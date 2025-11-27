# 🎤 HƯỚNG DẪN SETUP GOOGLE CLOUD SPEECH-TO-TEXT

## Tổng quan

Để sử dụng **Speech-to-Text (STT)** đầy đủ trên Mobile App, bạn cần:
- Google Cloud Project
- Speech-to-Text API enabled
- Service Account với credentials

**Lưu ý:**
- Web App STT **KHÔNG CẦN** setup này (sử dụng Web Speech API - miễn phí)
- Mobile App STT cần Google Cloud (có FREE tier: 60 phút/tháng)

---

## ✅ TÌNH TRẠNG STT HIỆN TẠI

| Platform | TTS | STT | Chi phí | Cần Setup |
|----------|-----|-----|---------|-----------|
| **Web** | ✅ 100% | ✅ 100% | MIỄN PHÍ | ❌ KHÔNG |
| **Mobile** | ✅ 100% | ⚠️ Cần Google Cloud | FREE 60 phút/tháng | ✅ CÓ |

---

## 📝 BƯỚC 1: TẠO GOOGLE CLOUD PROJECT

### 1.1. Truy cập Google Cloud Console
👉 https://console.cloud.google.com/

### 1.2. Tạo Project mới
1. Click "Select a project" ở góc trên bên trái
2. Click "NEW PROJECT"
3. Điền thông tin:
   - **Project name**: `agribank-digital-guard`
   - **Organization**: (để trống nếu không có)
4. Click **CREATE**

⏱️ Đợi 1-2 phút để project được tạo

---

## 📝 BƯỚC 2: ENABLE SPEECH-TO-TEXT API

### 2.1. Chọn Project vừa tạo
Click vào project name để switch sang project mới

### 2.2. Enable API
1. Vào menu ☰ > **APIs & Services** > **Library**
2. Search: `Speech-to-Text API`
3. Click vào **Cloud Speech-to-Text API**
4. Click **ENABLE**

⏱️ Đợi vài giây để API được kích hoạt

---

## 📝 BƯỚC 3: TẠO SERVICE ACCOUNT

### 3.1. Vào IAM & Admin
Menu ☰ > **IAM & Admin** > **Service Accounts**

### 3.2. Create Service Account
1. Click **+ CREATE SERVICE ACCOUNT**
2. Điền thông tin:
   - **Service account name**: `agribank-stt-service`
   - **Service account ID**: (tự động generate)
   - **Description**: `Service account for Speech-to-Text`
3. Click **CREATE AND CONTINUE**

### 3.3. Grant Permissions
1. Select a role: **Cloud Speech-to-Text API User**
   - Search: `Cloud Speech`
   - Chọn: **Cloud Speech-to-Text API User**
2. Click **CONTINUE**
3. Click **DONE**

---

## 📝 BƯỚC 4: TẠO VÀ DOWNLOAD KEY

### 4.1. Tạo Key
1. Trong danh sách Service Accounts, click vào service account vừa tạo
2. Tab **KEYS** > **ADD KEY** > **Create new key**
3. Chọn **JSON**
4. Click **CREATE**

📥 File JSON sẽ được download tự động (tên dạng: `agribank-digital-guard-xxx.json`)

### 4.2. Bảo mật Key
⚠️ **QUAN TRỌNG:**
- File này chứa credentials quan trọng
- KHÔNG commit lên Git
- KHÔNG share với người khác
- Lưu ở nơi an toàn

---

## 📝 BƯỚC 5: CẤU HÌNH BACKEND

### 5.1. Copy Key file vào Backend
```bash
# Copy file JSON vào thư mục backend
cp /path/to/downloaded-key.json /home/user/GUARD2711/backend/google-cloud-key.json
```

### 5.2. Update file .env
Mở `backend/.env` và cập nhật:

```env
# Option 1: Using key file path (RECOMMENDED)
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json

# Option 2: Using JSON string (Alternative)
# GOOGLE_CLOUD_CREDENTIALS_JSON={"type":"service_account",...}
```

### 5.3. Cài đặt Dependencies
```bash
cd backend
npm install
```

Package `@google-cloud/speech` đã có trong `package.json`

---

## 📝 BƯỚC 6: TEST STT

### 6.1. Start Backend
```bash
cd backend
npm start
```

### 6.2. Check STT Availability
```bash
curl http://localhost:5000/api/speech/check
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "available": true,
  "message": "Speech-to-Text is available"
}
```

### 6.3. Test trên Mobile App
1. Start mobile app
2. Nhấn nút 🎤 để ghi âm
3. Nói "Xin chào, tôi muốn hỏi về lừa đảo"
4. Nhấn ⏹️ để dừng
5. App sẽ tự động:
   - Upload audio
   - Chuyển thành text
   - Gửi cho AI
   - Hiển thị kết quả

---

## 💰 CHI PHÍ

### Free Tier (Đủ cho demo & presentation)
- **60 phút/tháng** - MIỄN PHÍ
- Áp dụng cho tất cả người dùng mới

### Sau Free Tier
- **$0.006 / 15 giây** (~$1.44/giờ)
- **$0.024 / phút**

### Ước tính cho demo:
- 100 lần test x 10 giây = 1,000 giây = ~17 phút
- **MIỄN PHÍ** (trong free tier)

### Tips tiết kiệm:
1. ✅ Chỉ enable khi demo/test
2. ✅ Disable sau khi trình bày xong
3. ✅ Sử dụng Web Speech API cho web (miễn phí)

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Speech client not initialized"
**Nguyên nhân:** Credentials không được cấu hình đúng

**Giải pháp:**
1. Kiểm tra file `google-cloud-key.json` có tồn tại không
2. Kiểm tra `backend/.env`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json
   ```
3. Restart backend server

### Lỗi: "Failed to transcribe audio"
**Nguyên nhân:** API chưa được enable hoặc quota hết

**Giải pháp:**
1. Kiểm tra Speech-to-Text API đã enable chưa
2. Kiểm tra quota: https://console.cloud.google.com/apis/api/speech.googleapis.com/quotas
3. Check billing account có active không

### Lỗi: "No speech detected in audio"
**Nguyên nhân:** Audio quality thấp hoặc không có giọng nói

**Giải pháp:**
1. Nói to và rõ ràng hơn
2. Kiểm tra microphone hoạt động
3. Thử ghi âm lại

### Lỗi: "Network error"
**Nguyên nhân:** Backend không kết nối được Google Cloud

**Giải pháp:**
1. Kiểm tra internet connection
2. Kiểm tra firewall không block Google APIs
3. Test connection: `ping speech.googleapis.com`

---

## 📊 MONITORING & USAGE

### Xem Usage
1. Vào: https://console.cloud.google.com/apis/dashboard
2. Select project: `agribank-digital-guard`
3. Click **Cloud Speech-to-Text API**
4. Tab **METRICS** - Xem usage chart

### Set Budget Alert
1. Menu ☰ > **Billing** > **Budgets & alerts**
2. **CREATE BUDGET**
3. Set amount: $5
4. Email alert khi đạt 50%, 90%, 100%

---

## 🎯 ALTERNATIVE: CHỈ DÙNG WEB STT

Nếu bạn không muốn setup Google Cloud, bạn có thể:

### Option 1: Chỉ demo Web App
- ✅ STT hoạt động 100% trên Web (Chrome/Edge)
- ✅ MIỄN PHÍ hoàn toàn
- ✅ Không cần setup gì thêm

### Option 2: Mobile chỉ có TTS
- ✅ TTS hoạt động 100%
- ❌ STT demo UI only
- Thông báo: "Tính năng trong roadmap"

### Option 3: Sử dụng free trial khác
- Wit.ai (Facebook) - Free unlimited
- Assembly AI - Free 3 hours/month
- IBM Watson STT - Free 500 minutes/month

---

## 📞 HỖ TRỢ

### Tài liệu Google Cloud
- Quickstart: https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries
- Pricing: https://cloud.google.com/speech-to-text/pricing
- Node.js Guide: https://cloud.google.com/speech-to-text/docs/libraries#client-libraries-install-nodejs

### Free Credits
- New users: $300 credit trong 90 ngày
- Đủ để test và demo nhiều lần

---

## ✅ CHECKLIST

Trước khi test:
- [ ] Google Cloud Project đã tạo
- [ ] Speech-to-Text API đã enable
- [ ] Service Account đã tạo
- [ ] Key file đã download
- [ ] Key file đã copy vào backend folder
- [ ] `.env` đã update với path đến key file
- [ ] Backend dependencies đã install
- [ ] Backend server đã restart
- [ ] Test API `/api/speech/check` thành công

---

## 🎉 KẾT LUẬN

Sau khi hoàn thành setup:
- ✅ Web App: STT hoạt động 100% (Web Speech API)
- ✅ Mobile App: STT hoạt động 100% (Google Cloud)
- ✅ Free tier: 60 phút/tháng
- ✅ Đủ cho demo và presentation

**Lưu ý:** Nếu chỉ demo cho buổi trình bày, Web App đã đủ (không cần Google Cloud)!

---

**Happy Coding!** 🚀
