@echo off
REM Script để chạy tất cả các services trên Windows
REM Chạy: scripts\start-all.bat

echo ======================================================
echo 🚀 AGRIBANK DIGITAL GUARD - STARTING ALL SERVICES
echo ======================================================
echo.

echo 📊 Lưu ý: Đảm bảo MongoDB đang chạy!
echo    Bạn có thể mở MongoDB Compass để khởi động MongoDB
echo.

echo 🔧 Đang khởi động Backend API...
start "Backend API" cmd /k "cd backend && npm start"
timeout /t 3

echo.
echo 🌐 Đang khởi động Web App...
start "Web App" cmd /k "cd web-app && npm start"
timeout /t 3

echo.
echo 📱 Đang khởi động Mobile App...
start "Mobile App" cmd /k "cd mobile-app && npm start"
timeout /t 3

echo.
echo ======================================================
echo ✅ TẤT CẢ SERVICES ĐÃ KHỞI ĐỘNG!
echo ======================================================
echo.
echo 📡 Backend API: http://localhost:5000
echo 🌐 Web App: http://localhost:3000
echo 📱 Mobile App: http://localhost:19006
echo.
echo Các cửa sổ terminal mới đã được mở cho mỗi service
echo Đóng cửa sổ terminal để dừng service tương ứng
echo.

pause
