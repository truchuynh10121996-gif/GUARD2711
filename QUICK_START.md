# 🚀 HƯỚNG DẪN NHANH - AGRIBANK DIGITAL GUARD

## ⚡ Chạy nhanh trong 5 phút!

### Bước 1: Cài đặt (3 phút)

```bash
# Windows - Chạy trong Command Prompt
scripts\install-all.bat

# Mac/Linux - Chạy trong Terminal
bash scripts/install-all.sh
```

### Bước 2: Cấu hình Gemini API (1 phút)

1. Lấy API key FREE tại: https://makersuite.google.com/app/apikey
2. Mở file `backend/.env`
3. Thay `your_gemini_api_key_here` bằng API key của bạn
4. Lưu file

### Bước 3: Khởi tạo Database (30 giây)

```bash
node scripts/setup-database.js
```

### Bước 4: Chạy hệ thống (30 giây)

```bash
# Windows
scripts\start-all.bat

# Mac/Linux
bash scripts/start-all.sh
```

## ✅ Truy cập ứng dụng:

- 🌐 **Web App**: http://localhost:3000
- 📡 **Backend API**: http://localhost:5000
- 📱 **Mobile App**: http://localhost:19006 (quét QR code bằng Expo Go)

## 📱 Để chạy Mobile App trên điện thoại:

1. Cài **Expo Go** app trên điện thoại
2. Tìm IP máy tính: `ipconfig` (Windows) hoặc `ifconfig` (Mac)
3. Sửa `mobile-app/constants/config.js`:
   ```javascript
   BASE_URL: 'http://YOUR_IP:5000/api'
   ```
4. Quét QR code bằng Expo Go

## 🧪 Thử nghiệm:

Hỏi chatbot:
- "Tôi nhận được tin nhắn yêu cầu cập nhật thông tin qua link"
- "Có người gọi hỏi mã OTP"
- "Có người mời đầu tư lãi suất cao"

## ❓ Lỗi?

Xem file `README.md` phần **Troubleshooting** để biết chi tiết!

---

**Chúc bạn thành công!** 🎉
