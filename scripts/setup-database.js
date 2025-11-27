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

    // Connect to MongoDB with improved connection options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,  // Tăng timeout lên 30s
      socketTimeoutMS: 60000,            // Socket timeout 60s
      connectTimeoutMS: 30000,           // Connect timeout 30s
      maxPoolSize: 10,                   // Connection pool size
    });
    console.log('✅ Đã kết nối MongoDB\n');

    // Đợi connection hoàn toàn sẵn sàng
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Đợi kết nối ổn định...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Clear existing data (optional - uncomment nếu muốn xóa dữ liệu cũ)
    // await Scenario.deleteMany({});
    // console.log('🗑️  Đã xóa scenarios cũ\n');

    // ✨ Tạo indexes trước khi insert data (fix timeout issue)
    console.log('⏳ Đang tạo database indexes...');
    try {
      await Scenario.collection.createIndex({ question: 'text', keywords: 'text' });
      await Scenario.collection.createIndex({ category: 1, language: 1 });
      console.log('✅ Đã tạo indexes\n');
    } catch (indexError) {
      // Indexes có thể đã tồn tại, bỏ qua lỗi
      if (indexError.code !== 85 && indexError.code !== 86) {
        throw indexError;
      }
      console.log('ℹ️  Indexes đã tồn tại\n');
    }

    // Load scenarios from JSON
    const scenariosPath = path.join(__dirname, '../shared/scenarios/initial-scenarios.json');
    const scenariosData = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));

    // Import scenarios với batch processing để tránh timeout
    console.log(`⏳ Đang import ${scenariosData.length} scenarios...`);
    const BATCH_SIZE = 50;
    let totalInserted = 0;

    for (let i = 0; i < scenariosData.length; i += BATCH_SIZE) {
      const batch = scenariosData.slice(i, i + BATCH_SIZE);
      await Scenario.insertMany(batch, {
        ordered: false,  // Tiếp tục insert ngay cả khi có lỗi
        rawResult: false
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
