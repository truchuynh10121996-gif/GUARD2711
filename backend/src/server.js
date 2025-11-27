require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const speechRoutes = require('./routes/speechRoutes');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AGRIBANK DIGITAL GUARD API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/speech', speechRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'AGRIBANK DIGITAL GUARD API',
    version: '1.0.0',
    description: 'Anti-Fraud Chatbot System for Agribank',
    endpoints: {
      chat: '/api/chat',
      scenarios: '/api/scenarios',
      analytics: '/api/analytics',
      speech: '/api/speech',
      health: '/health'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log('   AGRIBANK DIGITAL GUARD API SERVER');
  console.log('   ========================================');
  console.log(`   🌐 Server running on port: ${PORT}`);
  console.log(`   📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   🔗 API URL: http://localhost:${PORT}`);
  console.log('   ========================================\n');
});

module.exports = app;
