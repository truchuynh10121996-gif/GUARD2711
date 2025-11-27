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

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB\n');

    // Clear existing data (optional - uncomment nếu muốn xóa dữ liệu cũ)
    // await Scenario.deleteMany({});
    // console.log('🗑️  Đã xóa scenarios cũ\n');

    // Load scenarios from JSON
    const scenariosPath = path.join(__dirname, '../shared/scenarios/initial-scenarios.json');
    const scenariosData = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));

    // Import scenarios
    const scenarios = await Scenario.insertMany(scenariosData);
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
    console.error('❌ Lỗi:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Run setup
setupDatabase();
