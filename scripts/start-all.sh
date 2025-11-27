#!/bin/bash

# Script để chạy tất cả các services
# Windows: Chạy bash start-all.sh hoặc dùng Git Bash

echo "🚀 AGRIBANK DIGITAL GUARD - STARTING ALL SERVICES"
echo "=================================================="
echo ""

# Kiểm tra MongoDB
echo "📊 Kiểm tra MongoDB..."
if pgrep -x "mongod" > /dev/null
then
    echo "✅ MongoDB đang chạy"
else
    echo "❌ MongoDB chưa chạy. Vui lòng khởi động MongoDB trước!"
    echo "   Windows: Mở MongoDB Compass hoặc chạy 'mongod' trong terminal"
    echo "   Mac: brew services start mongodb-community"
    echo "   Linux: sudo systemctl start mongod"
    exit 1
fi

echo ""
echo "🔧 Đang khởi động Backend API..."
cd backend
npm start &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

echo ""
echo "🌐 Đang khởi động Web App..."
cd ../web-app
npm start &
WEB_PID=$!
echo "   Web PID: $WEB_PID"

echo ""
echo "📱 Đang khởi động Mobile App..."
cd ../mobile-app
npm start &
MOBILE_PID=$!
echo "   Mobile PID: $MOBILE_PID"

echo ""
echo "=================================================="
echo "✅ TẤT CẢ SERVICES ĐÃ KHỞI ĐỘNG!"
echo "=================================================="
echo ""
echo "📡 Backend API: http://localhost:5000"
echo "🌐 Web App: http://localhost:3000"
echo "📱 Mobile App: http://localhost:19006"
echo ""
echo "Nhấn Ctrl+C để dừng tất cả services"
echo ""

# Wait for all background processes
wait
