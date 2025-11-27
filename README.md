# 🛡️ AGRIBANK DIGITAL GUARD

## Hệ Thống Chatbot Phòng Chống Lừa Đảo Enterprise

![Agribank Logo](./logo-agribank1.png)

---

## 📋 MỤC LỤC

1. [Giới thiệu](#giới-thiệu)
2. [Tính năng](#tính-năng)
3. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
4. [Cấu trúc dự án](#cấu-trúc-dự-án)
5. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
6. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
7. [Hướng dẫn chạy dự án](#hướng-dẫn-chạy-dự-án)
8. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
9. [API Documentation](#api-documentation)
10. [Cấu hình](#cấu-hình)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 GIỚI THIỆU

**Agribank Digital Guard** là hệ thống chatbot AI thông minh được xây dựng để bảo vệ khách hàng Agribank khỏi các hình thức lừa đảo trực tuyến. Hệ thống sử dụng công nghệ AI tiên tiến (Google Gemini) để:

- ✅ Phát hiện và cảnh báo các tình huống lừa đảo
- ✅ Tư vấn và hướng dẫn xử lý an toàn
- ✅ Giáo dục người dùng về các thủ đoạn lừa đảo phổ biến
- ✅ Hỗ trợ đa ngôn ngữ (Tiếng Việt, English, ភាសាខ្មែរ)

---

## ✨ TÍNH NĂNG

### 🤖 Chatbot AI

- **Trả lời tự nhiên**: Sử dụng Gemini AI để hiểu và trả lời ngôn ngữ tự nhiên
- **Phát hiện lừa đảo**: Tự động phân tích và cảnh báo các dấu hiệu lừa đảo
- **Đa ngôn ngữ**: Tự động nhận diện và trả lời bằng ngôn ngữ người dùng sử dụng
- **Cảnh báo thông minh**: Phân loại mức độ nguy hiểm (Safe, Warning, Danger)

### 🎤 Tính năng Voice

- **Speech-to-Text (STT)**: Ghi âm và chuyển giọng nói thành văn bản
- **Text-to-Speech (TTS)**: Phát giọng nói từ câu trả lời của chatbot
- **Hỗ trợ đa ngôn ngữ**: Voice support cho tiếng Việt, English, Khmer

### 📱 Mobile App

- Giao diện thân thiện, dễ sử dụng
- Theme pastel gradient đẹp mắt
- Lưu lịch sử hội thoại
- Offline support (coming soon)

### 💻 Web App

- **Chatbot Interface**: Giao diện chat đầy đủ tính năng
- **Admin Dashboard**: Quản trị và thống kê
  - Thống kê hội thoại và tin nhắn
  - Biểu đồ phân tích theo thời gian
  - Quản lý scenarios Q&A
  - Thống kê phát hiện lừa đảo

### 🗄️ Backend API

- RESTful API architecture
- MongoDB database
- Gemini AI integration
- Analytics system
- Q&A scenarios management

---

## 🚀 CÔNG NGHỆ SỬ DỤNG

### Backend
- **Node.js** v18+ - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Google Gemini AI** - AI language model

### Mobile App
- **React Native** - Mobile framework
- **Expo SDK 54.0.0** - Development platform
- **Expo Speech** - Text-to-Speech
- **Expo AV** - Audio recording

### Web App
- **React.js** 18.x - UI library
- **Recharts** - Data visualization
- **Axios** - HTTP client

### DevOps
- **Git** - Version control
- **npm** - Package manager

---

## 📁 CẤU TRÚC DỰ ÁN

```
GUARD2711/
├── backend/                    # Backend API Server
│   ├── src/
│   │   ├── config/            # Database & Gemini config
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   └── server.js          # Entry point
│   ├── package.json
│   └── .env                   # Environment variables
│
├── mobile-app/                # React Native Mobile App
│   ├── app/                   # Main app screen
│   ├── components/            # Reusable components
│   ├── services/              # API & Speech services
│   ├── constants/             # Colors, config
│   ├── assets/                # Images, icons
│   ├── App.js                 # Root component
│   ├── app.json               # Expo configuration
│   └── package.json
│
├── web-app/                   # React Web Application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── styles/            # CSS files
│   │   └── App.js             # Root component
│   ├── public/                # Static files
│   └── package.json
│
├── shared/                    # Shared resources
│   ├── scenarios/             # Q&A scenarios data
│   └── constants/             # Shared constants
│
├── scripts/                   # Utility scripts
│   ├── setup-database.js      # DB initialization
│   ├── install-all.bat        # Install all (Windows)
│   ├── install-all.sh         # Install all (Mac/Linux)
│   ├── start-all.bat          # Start all (Windows)
│   └── start-all.sh           # Start all (Mac/Linux)
│
├── logo-agribank1.png         # Logo
└── README.md                  # Documentation
```

---

## 💻 YÊU CẦU HỆ THỐNG

### Phần mềm cần thiết:

1. **Node.js** (v18.x hoặc cao hơn)
   - Download: https://nodejs.org/
   - Kiểm tra: `node --version`

2. **MongoDB** (v6.x hoặc cao hơn)
   - Download: https://www.mongodb.com/try/download/community
   - Hoặc dùng MongoDB Compass (GUI)
   - Kiểm tra: `mongod --version`

3. **npm** (đi kèm với Node.js)
   - Kiểm tra: `npm --version`

4. **Git** (optional, cho version control)
   - Download: https://git-scm.com/

### Cho Mobile Development:

5. **Expo Go App** (trên điện thoại)
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

### API Keys:

6. **Google Gemini API Key**
   - Đăng ký tại: https://makersuite.google.com/app/apikey
   - **QUAN TRỌNG**: Free API key, không mất phí!

---

## 📥 HƯỚNG DẪN CÀI ĐẶT

### Bước 1: Clone hoặc Download dự án

Nếu bạn có dự án này rồi, bỏ qua bước này.

### Bước 2: Cài đặt MongoDB

#### Windows:
1. Download MongoDB Community Server từ https://www.mongodb.com/try/download/community
2. Cài đặt với các tùy chọn mặc định
3. Mở **MongoDB Compass** (GUI tool đi kèm)
4. Kết nối đến `mongodb://localhost:27017`

#### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Bước 3: Lấy Gemini API Key

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng Google Account
3. Click "Create API Key"
4. Copy API key (dạng: `AIza...`)
5. **LƯU Ý**: API key này là FREE, không tính phí!

### Bước 4: Cài đặt Dependencies

#### Trên Windows:
```bash
# Mở Command Prompt hoặc PowerShell tại thư mục dự án
cd C:\path\to\GUARD2711

# Chạy script cài đặt
scripts\install-all.bat
```

#### Trên Mac/Linux:
```bash
# Mở Terminal tại thư mục dự án
cd /path/to/GUARD2711

# Cấp quyền thực thi cho script
chmod +x scripts/install-all.sh

# Chạy script cài đặt
bash scripts/install-all.sh
```

**Script này sẽ tự động cài đặt dependencies cho:**
- Backend
- Mobile App
- Web App
- Scripts utilities

⏱️ **Thời gian**: 5-10 phút (tùy tốc độ internet)

### Bước 5: Cấu hình Environment Variables

1. Mở file `backend/.env`
2. Thay `your_gemini_api_key_here` bằng API key thực của bạn:

```env
GEMINI_API_KEY=AIzaSyABC123...xyz789  # API key của bạn
```

3. Lưu file

### Bước 6: Khởi tạo Database

```bash
# Từ thư mục gốc của dự án
node scripts/setup-database.js
```

Script này sẽ:
- ✅ Tạo database `agribank-digital-guard`
- ✅ Import 10 scenarios Q&A mẫu (tiếng Việt, English, Khmer)
- ✅ Khởi tạo analytics collections

---

## 🎮 HƯỚNG DẪN CHẠY DỰ ÁN

### Cách 1: Chạy tất cả cùng lúc (KHUYẾN NGHỊ)

#### Windows:
```bash
scripts\start-all.bat
```

#### Mac/Linux:
```bash
bash scripts/start-all.sh
```

Script sẽ tự động mở 3 terminal windows cho:
- 🔧 Backend API (Port 5000)
- 🌐 Web App (Port 3000)
- 📱 Mobile App (Port 19006)

### Cách 2: Chạy từng service riêng

Mở 3 terminal windows riêng biệt:

#### Terminal 1 - Backend:
```bash
cd backend
npm start
```

#### Terminal 2 - Web App:
```bash
cd web-app
npm start
```

#### Terminal 3 - Mobile App:
```bash
cd mobile-app
npm start
```

---

## 📖 HƯỚNG DẪN SỬ DỤNG

### A. SỬ DỤNG WEB APP (trên máy tính)

1. **Mở trình duyệt** và truy cập: http://localhost:3000

2. **Giao diện chính** bao gồm 2 tabs:

   **Tab 1: 💬 Chatbot**
   - Giao diện chat với AI
   - Nhập câu hỏi vào ô input
   - Click nút ➤ để gửi
   - Chatbot sẽ trả lời và cảnh báo nếu phát hiện lừa đảo
   - Click 🔊 để nghe giọng nói

   **Tab 2: 📊 Dashboard**
   - Xem thống kê tổng quan
   - Biểu đồ hoạt động theo ngày
   - Phân bố nền tảng (Mobile/Web)
   - Phân bố ngôn ngữ
   - Danh sách scenarios Q&A

### B. SỬ DỤNG MOBILE APP (trên điện thoại)

#### Bước 1: Chuẩn bị

1. Cài đặt **Expo Go** trên điện thoại:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Đảm bảo điện thoại và máy tính **cùng mạng WiFi**

#### Bước 2: Cấu hình IP Address (QUAN TRỌNG!)

1. **Tìm địa chỉ IP của máy tính:**

   **Windows:**
   ```bash
   ipconfig
   # Tìm "IPv4 Address" (dạng: 192.168.1.100)
   ```

   **Mac/Linux:**
   ```bash
   ifconfig
   # hoặc
   ip addr show
   # Tìm IP dạng: 192.168.1.100
   ```

2. **Cập nhật file config:**
   - Mở file: `mobile-app/constants/config.js`
   - Sửa dòng:
   ```javascript
   BASE_URL: 'http://192.168.1.100:5000/api',  // Thay bằng IP của bạn
   ```

#### Bước 3: Chạy app

1. Start mobile app:
   ```bash
   cd mobile-app
   npm start
   ```

2. Một QR code sẽ hiện ra trong terminal

3. **Quét QR code:**
   - **iOS**: Dùng Camera app quét QR code
   - **Android**: Dùng Expo Go app quét QR code

4. App sẽ tự động load trên điện thoại!

#### Bước 4: Sử dụng app

- **Nhập văn bản**: Gõ câu hỏi và click ➤
- **Ghi âm**: Click 🎤 để bắt đầu ghi âm, click ⏹️ để dừng
- **Nghe giọng nói**: Click 🔊 ở các tin nhắn của bot
- **Xóa lịch sử**: Click "🗑️ Xóa lịch sử"

### C. THỬ NGHIỆM HỆ THỐNG

Hãy thử các tình huống sau:

**Tình huống 1 - Phishing SMS:**
```
"Tôi nhận được tin nhắn từ Agribank yêu cầu click vào link để cập nhật thông tin tài khoản"
```

**Tình huống 2 - Yêu cầu OTP:**
```
"Có người gọi điện tự xưng là nhân viên ngân hàng và hỏi mã OTP của tôi"
```

**Tình huống 3 - Đầu tư ma:**
```
"Có người mời tôi đầu tư online với lãi suất 10%/tháng"
```

**Tình huống 4 - English:**
```
"I received an email asking me to verify my bank account"
```

Bot sẽ:
- ✅ Phát hiện dấu hiệu lừa đảo
- ✅ Đưa ra cảnh báo (🚨 hoặc ⚠️)
- ✅ Hướng dẫn cách xử lý an toàn

---

## 🔌 API DOCUMENTATION

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Chat APIs

**1. Create Session**
```http
POST /api/chat/session
Content-Type: application/json

{
  "platform": "mobile",  // "mobile" | "web"
  "metadata": {}
}

Response:
{
  "success": true,
  "sessionId": "uuid-string"
}
```

**2. Send Message**
```http
POST /api/chat/message
Content-Type: application/json

{
  "sessionId": "uuid-string",
  "message": "Câu hỏi của user"
}

Response:
{
  "success": true,
  "data": {
    "response": "Câu trả lời từ AI",
    "language": "vi",
    "isFraudDetected": true,
    "riskLevel": "danger"
  }
}
```

**3. Get Conversation**
```http
GET /api/chat/:sessionId

Response:
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "messages": [...],
    "totalFraudWarnings": 5
  }
}
```

#### Analytics APIs

**1. Get Dashboard Analytics**
```http
GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31

Response:
{
  "success": true,
  "data": {
    "summary": {...},
    "analytics": [...],
    "recentConversations": [...]
  }
}
```

**2. Get Fraud Statistics**
```http
GET /api/analytics/fraud

Response:
{
  "success": true,
  "data": {
    "totalConversations": 100,
    "conversationsWithFraud": 25,
    "fraudDetectionRate": "25.00"
  }
}
```

#### Scenarios APIs

**1. Get All Scenarios**
```http
GET /api/scenarios?language=vi&category=phishing

Response:
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

**2. Create Scenario**
```http
POST /api/scenarios
Content-Type: application/json

{
  "category": "phishing",
  "question": "...",
  "answer": "...",
  "language": "vi",
  "keywords": ["..."],
  "riskLevel": "danger"
}
```

**3. Update Scenario**
```http
PUT /api/scenarios/:id
Content-Type: application/json

{
  "answer": "Updated answer..."
}
```

**4. Delete Scenario**
```http
DELETE /api/scenarios/:id
```

---

## ⚙️ CẤU HÌNH

### Thêm Q&A Scenarios Mới

#### Cách 1: Qua Admin Dashboard (Web)
1. Truy cập http://localhost:3000
2. Chọn tab "📊 Dashboard"
3. Xem danh sách scenarios hiện có

#### Cách 2: Qua API
```javascript
// Sử dụng Postman hoặc curl
POST http://localhost:5000/api/scenarios
Content-Type: application/json

{
  "category": "phone_scam",
  "question": "Câu hỏi mẫu về tình huống lừa đảo",
  "answer": "Câu trả lời chi tiết hướng dẫn xử lý",
  "language": "vi",
  "keywords": ["lừa đảo", "điện thoại", "otp"],
  "riskLevel": "danger",
  "isActive": true
}
```

#### Cách 3: Import hàng loạt
1. Tạo file JSON với format:
```json
[
  {
    "category": "phishing",
    "question": "...",
    "answer": "...",
    "language": "vi",
    "keywords": ["..."],
    "riskLevel": "danger"
  }
]
```

2. Gọi API:
```http
POST /api/scenarios/bulk
Content-Type: application/json

{
  "scenarios": [...]
}
```

### Categories Available:
- `phishing` - Lừa đảo qua email/SMS
- `fake_website` - Website giả mạo
- `phone_scam` - Lừa đảo qua điện thoại
- `social_engineering` - Kỹ thuật xã hội
- `fake_investment` - Đầu tư ma
- `identity_theft` - Đánh cắp danh tính
- `lottery_scam` - Lừa đảo trúng thưởng
- `fake_support` - Giả mạo hỗ trợ KH
- `other` - Khác

---

## 🔧 TROUBLESHOOTING

### Lỗi thường gặp:

#### 1. "Cannot connect to MongoDB"

**Nguyên nhân**: MongoDB chưa chạy

**Giải pháp**:
- Windows: Mở MongoDB Compass và connect
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

#### 2. "Failed to generate response from Gemini API"

**Nguyên nhân**: API key không hợp lệ hoặc chưa cấu hình

**Giải pháp**:
1. Kiểm tra file `backend/.env`
2. Đảm bảo `GEMINI_API_KEY` đã được set đúng
3. Thử tạo API key mới tại https://makersuite.google.com/app/apikey

#### 3. Mobile app không kết nối được backend

**Nguyên nhân**: IP address không đúng

**Giải pháp**:
1. Tìm IP address của máy tính: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
2. Cập nhật `mobile-app/constants/config.js`:
   ```javascript
   BASE_URL: 'http://YOUR_IP_ADDRESS:5000/api'
   ```
3. Đảm bảo điện thoại và máy tính cùng mạng WiFi

#### 4. "Port 5000 is already in use"

**Nguyên nhân**: Port đã bị chiếm bởi ứng dụng khác

**Giải pháp**:
1. Đổi port trong `backend/.env`:
   ```env
   PORT=5001
   ```
2. Cập nhật config trong mobile-app và web-app

#### 5. Web app không load được

**Nguyên nhân**: Dependencies chưa được cài đặt đầy đủ

**Giải pháp**:
```bash
cd web-app
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 6. Expo Go không tìm thấy server

**Nguyên nhân**: Firewall chặn kết nối

**Giải pháp**:
- Windows: Cho phép Node.js qua Windows Firewall
- Mac: System Preferences > Security & Privacy > Firewall > Allow Node

---

## 📊 THỐNG KÊ DỰ ÁN

- **Tổng số files**: 50+
- **Tổng dòng code**: 3000+ lines
- **Số lượng components**: 15+
- **API endpoints**: 12+
- **Database models**: 3
- **Scenarios mẫu**: 10
- **Ngôn ngữ hỗ trợ**: 3 (VI, EN, KM)

---

## 👨‍💻 PHÁT TRIỂN THÊM

### Tính năng có thể mở rộng:

1. **Authentication & Authorization**
   - User login/register
   - Role-based access control
   - JWT tokens

2. **Advanced AI Features**
   - Image analysis (nhận dạng ảnh lừa đảo)
   - Voice cloning detection
   - Link scanning

3. **Notifications**
   - Push notifications
   - Email alerts
   - SMS warnings

4. **Reporting System**
   - Report fraud cases
   - Case management
   - Integration with authorities

5. **Offline Support**
   - Offline scenarios database
   - Local AI model
   - Sync when online

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề khi sử dụng:

1. Kiểm tra lại phần [Troubleshooting](#troubleshooting)
2. Đảm bảo tất cả dependencies đã được cài đặt
3. Kiểm tra MongoDB đang chạy
4. Kiểm tra Gemini API key hợp lệ

---

## 📝 LICENSE

This project is created for educational and anti-fraud purposes.

---

## 🎉 KẾT LUẬN

Bạn đã hoàn thành việc setup **AGRIBANK DIGITAL GUARD** - một hệ thống chatbot phòng chống lừa đảo enterprise đầy đủ tính năng!

**Chúc bạn trình bày thành công!** 🚀

---

**Developed with ❤️ for Agribank**

**Version**: 1.0.0
**Last Updated**: November 2024
