# Database Setup Scripts

## 🚀 Quick Start

### Bước 1: Test MongoDB Connection (QUAN TRỌNG!)

**Chạy script test TRƯỚC để đảm bảo MongoDB hoạt động:**

```bash
node scripts/test-mongodb-connection.js
```

Nếu test thành công, bạn sẽ thấy:
```
✅ THÀNH CÔNG! MongoDB hoạt động bình thường.
💡 Bạn có thể chạy: node scripts/setup-database.js
```

### Bước 2: Khởi tạo Database

```bash
node scripts/setup-database.js
```

---

## Yêu cầu trước khi chạy

### 1. Đảm bảo MongoDB đang chạy

**Kiểm tra MongoDB:**
```bash
# Windows (cmd/PowerShell)
tasklist | findstr mongod

# Hoặc kiểm tra service
sc query MongoDB
```

**Nếu MongoDB chưa chạy, khởi động:**
```bash
# Cách 1: Khởi động service
net start MongoDB

# Cách 2: Chạy mongod trực tiếp
mongod --dbpath C:\data\db
```

### 2. Test kết nối MongoDB

```bash
# Dùng mongosh hoặc mongo CLI
mongosh mongodb://localhost:27017

# Trong mongosh, test:
> show dbs
> use agribank-digital-guard
> db.stats()
```

### 3. Kiểm tra file .env

Đảm bảo file `backend/.env` tồn tại và có cấu hình đúng:
```env
MONGODB_URI=mongodb://localhost:27017/agribank-digital-guard
```

## Chạy Database Setup

```bash
node scripts/setup-database.js
```

## Các lỗi thường gặp

### ❌ Connection timeout
**Nguyên nhân:** MongoDB chưa chạy hoặc chạy sai port
**Giải pháp:** Kiểm tra MongoDB đang chạy ở port 27017

### ❌ Operation buffering timed out
**Nguyên nhân:** MongoDB quá chậm hoặc quá tải
**Giải pháp:**
- Đảm bảo máy có đủ RAM
- Restart MongoDB service
- Xóa data cũ trong MongoDB nếu bị corrupt

### ❌ ECONNREFUSED
**Nguyên nhân:** MongoDB không chạy
**Giải pháp:** Khởi động MongoDB service

## Xóa và khởi tạo lại database

Nếu muốn xóa toàn bộ data và khởi tạo lại:

```bash
# Trong mongosh
> use agribank-digital-guard
> db.dropDatabase()
> exit

# Chạy lại setup
node scripts/setup-database.js
```
