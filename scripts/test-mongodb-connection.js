/**
 * Script để test MongoDB connection
 * Chạy script này TRƯỚC KHI chạy setup-database.js
 * Chạy: node scripts/test-mongodb-connection.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const testConnection = async () => {
  console.log('🔍 Đang kiểm tra MongoDB connection...\n');

  // Kiểm tra MONGODB_URI
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI không tồn tại trong file .env');
    console.log('💡 Hãy tạo file backend/.env và thêm:');
    console.log('   MONGODB_URI=mongodb://localhost:27017/agribank-digital-guard\n');
    process.exit(1);
  }

  console.log('✅ MONGODB_URI:', process.env.MONGODB_URI);

  try {
    // Test connection với timeout ngắn
    console.log('\n⏳ Đang kết nối MongoDB...');

    const startTime = Date.now();
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout cho test
      connectTimeoutMS: 10000,
    });

    const connectionTime = Date.now() - startTime;
    console.log(`✅ Kết nối thành công trong ${connectionTime}ms\n`);

    // Kiểm tra connection info
    const db = mongoose.connection.db;
    const admin = db.admin();

    console.log('📊 Thông tin MongoDB:');
    console.log('   Database:', db.databaseName);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port);

    // Kiểm tra database stats
    const stats = await db.stats();
    console.log('\n📈 Database Stats:');
    console.log('   Collections:', stats.collections);
    console.log('   Data Size:', (stats.dataSize / 1024).toFixed(2), 'KB');
    console.log('   Storage Size:', (stats.storageSize / 1024).toFixed(2), 'KB');

    // Test tạo index đơn giản
    console.log('\n🔧 Test tạo index...');
    const testCollection = db.collection('_connection_test');
    await testCollection.createIndex({ test: 1 }, { maxTimeMS: 5000 });
    await testCollection.drop();
    console.log('✅ Tạo index thành công');

    console.log('\n✅ THÀNH CÔNG! MongoDB hoạt động bình thường.');
    console.log('💡 Bạn có thể chạy: node scripts/setup-database.js\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ LỖI kết nối MongoDB:\n');

    if (error.name === 'MongoServerSelectionError') {
      console.error('   Không thể kết nối đến MongoDB server');
      console.log('\n💡 Giải pháp:');
      console.log('   1. Kiểm tra MongoDB đang chạy:');
      console.log('      - Windows: tasklist | findstr mongod');
      console.log('      - Linux/Mac: ps aux | grep mongod');
      console.log('   2. Khởi động MongoDB:');
      console.log('      - Windows: net start MongoDB');
      console.log('      - Linux: sudo systemctl start mongod');
      console.log('      - Mac: brew services start mongodb-community');
      console.log('   3. Kiểm tra port 27017 đang mở:');
      console.log('      - netstat -an | findstr 27017\n');
    } else if (error.name === 'MongooseError') {
      console.error('   Mongoose configuration error');
      console.log('\n💡 Kiểm tra MONGODB_URI trong file backend/.env\n');
    } else {
      console.error('   ' + error.message);
    }

    await mongoose.connection.close();
    process.exit(1);
  }
};

testConnection();
