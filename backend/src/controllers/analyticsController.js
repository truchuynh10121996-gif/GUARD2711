const { getAnalytics, getSummaryStats } = require('../services/analyticsService');
const Conversation = require('../models/Conversation');

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // Default to last 30 days
    if (!startDate) {
      start.setDate(start.getDate() - 30);
    }

    const analytics = await getAnalytics(start, end);
    const summary = await getSummaryStats();

    // Get recent conversations
    const recentConversations = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('sessionId platform totalFraudWarnings createdAt messages');

    res.json({
      success: true,
      data: {
        summary,
        analytics,
        recentConversations
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Get fraud statistics
const getFraudStats = async (req, res) => {
  try {
    const totalConversations = await Conversation.countDocuments();
    const conversationsWithFraud = await Conversation.countDocuments({
      totalFraudWarnings: { $gt: 0 }
    });

    const fraudMessages = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.isFraudDetected': true } },
      { $group: {
        _id: '$messages.riskLevel',
        count: { $sum: 1 }
      }}
    ]);

    res.json({
      success: true,
      data: {
        totalConversations,
        conversationsWithFraud,
        fraudDetectionRate: totalConversations > 0
          ? ((conversationsWithFraud / totalConversations) * 100).toFixed(2)
          : 0,
        fraudMessages
      }
    });
  } catch (error) {
    console.error('Get fraud stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fraud statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getFraudStats
};
