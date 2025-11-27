#!/bin/bash

# Script để cài đặt dependencies cho tất cả projects
# Chạy: bash scripts/install-all.sh

echo "📦 AGRIBANK DIGITAL GUARD - INSTALLING DEPENDENCIES"
echo "===================================================="
echo ""

echo "🔧 Cài đặt Backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies đã được cài đặt"
echo ""

echo "🌐 Cài đặt Web App dependencies..."
cd ../web-app
npm install
echo "✅ Web App dependencies đã được cài đặt"
echo ""

echo "📱 Cài đặt Mobile App dependencies..."
cd ../mobile-app
npm install
echo "✅ Mobile App dependencies đã được cài đặt"
echo ""

echo "📊 Cài đặt Scripts dependencies..."
cd ../scripts
npm install mongoose dotenv
echo "✅ Scripts dependencies đã được cài đặt"
echo ""

echo "===================================================="
echo "🎉 HOÀN TẤT! Tất cả dependencies đã được cài đặt"
echo "===================================================="
echo ""
echo "📝 Bước tiếp theo:"
echo "   1. Cấu hình file backend/.env với Gemini API key"
echo "   2. Chạy: node scripts/setup-database.js"
echo "   3. Chạy: bash scripts/start-all.sh"
echo ""
