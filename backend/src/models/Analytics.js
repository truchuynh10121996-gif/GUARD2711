const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  metrics: {
    totalConversations: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    fraudWarnings: {
      type: Number,
      default: 0
    },
    uniqueUsers: {
      type: Number,
      default: 0
    },
    byPlatform: {
      mobile: { type: Number, default: 0 },
      web: { type: Number, default: 0 }
    },
    byLanguage: {
      vi: { type: Number, default: 0 },
      en: { type: Number, default: 0 },
      km: { type: Number, default: 0 }
    },
    byCategory: {
      phishing: { type: Number, default: 0 },
      fake_website: { type: Number, default: 0 },
      phone_scam: { type: Number, default: 0 },
      social_engineering: { type: Number, default: 0 },
      fake_investment: { type: Number, default: 0 },
      identity_theft: { type: Number, default: 0 },
      lottery_scam: { type: Number, default: 0 },
      fake_support: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

// Unique index on date (one record per day)
analyticsSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
