@echo off
REM Script để cài đặt dependencies cho tất cả projects trên Windows
REM Chạy: scripts\install-all.bat

echo ====================================================
echo 📦 AGRIBANK DIGITAL GUARD - INSTALLING DEPENDENCIES
echo ====================================================
echo.

echo 🔧 Cài đặt Backend dependencies...
cd backend
call npm install
echo ✅ Backend dependencies đã được cài đặt
echo.

echo 🌐 Cài đặt Web App dependencies...
cd ..\web-app
call npm install
echo ✅ Web App dependencies đã được cài đặt
echo.

echo 📱 Cài đặt Mobile App dependencies...
cd ..\mobile-app
call npm install
echo ✅ Mobile App dependencies đã được cài đặt
echo.

echo 📊 Cài đặt Scripts dependencies...
cd ..\scripts
call npm install mongoose dotenv
echo ✅ Scripts dependencies đã được cài đặt
echo.

cd ..

echo ====================================================
echo 🎉 HOÀN TẤT! Tất cả dependencies đã được cài đặt
echo ====================================================
echo.
echo 📝 Bước tiếp theo:
echo    1. Cấu hình file backend\.env với Gemini API key
echo    2. Chạy: node scripts\setup-database.js
echo    3. Chạy: scripts\start-all.bat
echo.

pause
