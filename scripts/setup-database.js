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

    // Connect to MongoDB with proper connection options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,  // Tăng timeout lên 30s
      socketTimeoutMS: 75000,            // Tăng socket timeout lên 75s
      connectTimeoutMS: 30000,           // Connection timeout
    });

    // Đợi connection thực sự sẵn sàng
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        mongoose.connection.once('open', resolve);
        mongoose.connection.once('error', reject);
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      });
    }

    console.log('✅ Đã kết nối MongoDB\n');
    console.log(`📊 Connection state: ${mongoose.connection.readyState} (1 = connected)\n`);

    // Test database thực sự hoạt động
    console.log('🔍 Đang kiểm tra database...');
    await mongoose.connection.db.admin().ping();
    console.log('✅ Database đang hoạt động bình thường\n');

    // Clear existing data (optional - uncomment nếu muốn xóa dữ liệu cũ)
    // await Scenario.deleteMany({});
    // console.log('🗑️  Đã xóa scenarios cũ\n');

    // Tạo indexes với timeout và error handling
    console.log('🔧 Đang tạo indexes...');
    try {
      // Sử dụng Promise.race để thêm timeout cho createIndexes
      await Promise.race([
        Scenario.createIndexes(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Index creation timeout')), 60000)
        )
      ]);
      console.log('✅ Đã tạo indexes\n');
    } catch (indexError) {
      // Nếu tạo indexes thất bại, tiếp tục vì indexes sẽ tự động tạo khi insert
      console.log('⚠️  Không thể tạo indexes ngay (sẽ tự động tạo khi insert data)\n');
      console.log(`   Lý do: ${indexError.message}\n`);
    }

    // Load scenarios from JSON
    const scenariosPath = path.join(__dirname, '../shared/scenarios/initial-scenarios.json');

    if (!fs.existsSync(scenariosPath)) {
      throw new Error(`File không tồn tại: ${scenariosPath}`);
    }

    const scenariosData = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
    console.log(`📖 Đã đọc ${scenariosData.length} scenarios từ file JSON\n`);

    // Kiểm tra xem đã có data chưa
    const existingCount = await Scenario.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Đã có ${existingCount} scenarios trong database`);
      console.log('💡 Bạn có thể uncomment dòng deleteMany() để xóa data cũ\n');
    }

    // Import scenarios
    console.log('📥 Đang import scenarios...');
    const scenarios = await Scenario.insertMany(scenariosData, { ordered: false });
    console.log(`✅ Đã import ${scenarios.length} scenarios\n`);

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
    console.error('\n❌ LỖI XẢY RA:\n');

    // Kiểm tra các loại lỗi thường gặp
    if (error.message.includes('ECONNREFUSED')) {
      console.error('🔴 Không thể kết nối MongoDB!');
      console.error('💡 Vui lòng kiểm tra:');
      console.error('   1. MongoDB đã được cài đặt chưa?');
      console.error('   2. MongoDB service đã chạy chưa? (mongod)');
      console.error('   3. MONGODB_URI trong .env có đúng không?');
      console.error(`   4. URI hiện tại: ${process.env.MONGODB_URI || 'CHƯA THIẾT LẬP'}\n`);
    } else if (error.message.includes('buffering timed out')) {
      console.error('🔴 Timeout khi thực hiện thao tác với MongoDB!');
      console.error('💡 Nguyên nhân có thể:');
      console.error('   1. MongoDB chưa sẵn sàng nhận connection');
      console.error('   2. Mạng chậm hoặc không ổn định');
      console.error('   3. MongoDB service bị treo\n');
    } else if (error.code === 11000) {
      console.error('🔴 Dữ liệu đã tồn tại (duplicate key)!');
      console.error('💡 Giải pháp: Uncomment dòng deleteMany() để xóa data cũ\n');
    } else {
      console.error('🔴 Lỗi chi tiết:', error.message);
      console.error('\n📋 Stack trace:');
      console.error(error.stack);
    }

    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('\n🔌 Đã đóng kết nối MongoDB');
    }
  }
};

// Run setup
setupDatabase();
