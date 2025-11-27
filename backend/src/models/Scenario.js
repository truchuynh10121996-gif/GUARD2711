const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'phishing',           // Lừa đảo qua email/SMS
      'fake_website',       // Website giả mạo
      'phone_scam',         // Lừa đảo qua điện thoại
      'social_engineering', // Kỹ thuật xã hội
      'fake_investment',    // Đầu tư ma
      'identity_theft',     // Đánh cắp danh tính
      'lottery_scam',       // Lừa đảo trúng thưởng
      'fake_support',       // Giả mạo hỗ trợ khách hàng
      'other'              // Khác
    ]
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['vi', 'en', 'km'],
    required: true
  },
  keywords: [{
    type: String
  }],
  riskLevel: {
    type: String,
    enum: ['safe', 'warning', 'danger'],
    default: 'warning'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  examples: [{
    type: String
  }]
}, {
  timestamps: true
});

// Text search index
scenarioSchema.index({ question: 'text', keywords: 'text' });
scenarioSchema.index({ category: 1, language: 1 });

module.exports = mongoose.model('Scenario', scenarioSchema);
