/**
 * Script để khởi tạo database và import scenarios mẫu
 * Chạy: node scripts/setup-database.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

// Import models
const Scenario = require('../backend/src/models/Scenario');
const Analytics = require('../backend/src/models/Analytics');

const setupDatabase = async () => {
  try {
    console.log('🚀 Bắt đầu khởi tạo database...\n');

    // Tắt buffering TRƯỚC KHI connect - FIX TIMEOUT ISSUE
    mongoose.set('bufferCommands', false);
    mongoose.set('autoIndex', false); // Tắt auto-index, tạo manual sau

    // Connect to MongoDB with improved connection options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,  // Tăng timeout lên 30s
      socketTimeoutMS: 60000,            // Socket timeout 60s
      connectTimeoutMS: 30000,           // Connect timeout 30s
      maxPoolSize: 10,                   // Connection pool size
      bufferCommands: false,             // TẮT BUFFERING - quan trọng!
      bufferTimeoutMS: 60000,            // Buffer timeout nếu buffering bật
    });

    console.log('✅ Đã kết nối MongoDB');

    // Đợi connection thực sự sẵn sàng
    const maxRetries = 5;
    let retries = 0;
    while (mongoose.connection.readyState !== 1 && retries < maxRetries) {
      console.log(`⏳ Đợi kết nối ổn định... (${retries + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      retries++;
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection không ổn định sau ' + maxRetries + ' lần thử');
    }

    console.log('✅ Kết nối MongoDB ổn định\n');

    // Clear existing data (optional - uncomment nếu muốn xóa dữ liệu cũ)
    // await Scenario.deleteMany({});
    // console.log('🗑️  Đã xóa scenarios cũ\n');

    // ✨ Tạo indexes trước khi insert data (fix timeout issue)
    console.log('⏳ Đang tạo database indexes...');
    try {
      // Sử dụng native MongoDB driver với maxTimeMS cao
      const db = mongoose.connection.db;
      const scenariosCollection = db.collection('scenarios');

      // Tạo text search index với timeout cao
      await scenariosCollection.createIndex(
        { question: 'text', keywords: 'text' },
        { maxTimeMS: 60000 } // 60s timeout
      );
      console.log('   ✓ Đã tạo text search index');

      // Tạo compound index
      await scenariosCollection.createIndex(
        { category: 1, language: 1 },
        { maxTimeMS: 60000 }
      );
      console.log('   ✓ Đã tạo compound index');

      console.log('✅ Đã tạo tất cả indexes\n');
    } catch (indexError) {
      // Indexes có thể đã tồn tại, bỏ qua lỗi
      if (indexError.code === 85 || indexError.code === 86 || indexError.codeName === 'IndexOptionsConflict') {
        console.log('ℹ️  Indexes đã tồn tại, bỏ qua\n');
      } else {
        throw indexError;
      }
    }

    // Load scenarios from JSON
    const scenariosPath = path.join(__dirname, '../shared/scenarios/initial-scenarios.json');
    const scenariosData = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));

    // Import scenarios với batch processing để tránh timeout
    console.log(`⏳ Đang import ${scenariosData.length} scenarios...`);
    const BATCH_SIZE = 100; // Tăng batch size vì đã tắt buffering
    let totalInserted = 0;

    // Sử dụng native MongoDB driver cho insert
    const db = mongoose.connection.db;
    const scenariosCollection = db.collection('scenarios');

    for (let i = 0; i < scenariosData.length; i += BATCH_SIZE) {
      const batch = scenariosData.slice(i, i + BATCH_SIZE);

      // Insert với native driver và timeout cao
      await scenariosCollection.insertMany(batch, {
        ordered: false,  // Tiếp tục insert ngay cả khi có lỗi
        maxTimeMS: 60000 // 60s timeout cho mỗi batch
      });

      totalInserted += batch.length;
      console.log(`   ✓ Đã import ${totalInserted}/${scenariosData.length} scenarios`);
    }

    console.log(`✅ Hoàn tất import ${totalInserted} scenarios\n`);

    // Create initial analytics record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAnalytics = await Analytics.findOne({ date: today });
    if (!existingAnalytics) {
      await Analytics.create({ date: today });
      console.log('✅ Đã tạo analytics record\n');
    }

    console.log('🎉 HOÀN TẤT! Database đã được khởi tạo thành công!\n');

    // Display scenarios count by category
    const categoryCounts = await Scenario.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    console.log('📊 Thống kê scenarios theo loại:');
    categoryCounts.forEach((cat) => {
      console.log(`   - ${cat._id}: ${cat.count}`);
    });

    console.log('\n✅ Bạn có thể bắt đầu sử dụng hệ thống!\n');
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Run setup
setupDatabase();
