const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['vi', 'en', 'km'],
    default: 'vi'
  },
  isFraudDetected: {
    type: Boolean,
    default: false
  },
  riskLevel: {
    type: String,
    enum: ['safe', 'warning', 'danger'],
    default: 'safe'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    default: 'anonymous'
  },
  platform: {
    type: String,
    enum: ['mobile', 'web'],
    default: 'mobile'
  },
  messages: [messageSchema],
  totalFraudWarnings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
conversationSchema.index({ createdAt: -1 });
conversationSchema.index({ 'messages.isFraudDetected': 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
