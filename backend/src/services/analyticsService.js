const Analytics = require('../models/Analytics');

// Get or create analytics for today
const getTodayAnalytics = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let analytics = await Analytics.findOne({ date: today });

  if (!analytics) {
    analytics = new Analytics({ date: today });
    await analytics.save();
  }

  return analytics;
};

// Update analytics
const updateAnalytics = async (updateData) => {
  try {
    const analytics = await getTodayAnalytics();

    // Update metrics
    if (updateData.conversation) {
      analytics.metrics.totalConversations += 1;
      if (updateData.platform) {
        analytics.metrics.byPlatform[updateData.platform] += 1;
      }
    }

    if (updateData.message) {
      analytics.metrics.totalMessages += 1;
      if (updateData.language) {
        analytics.metrics.byLanguage[updateData.language] += 1;
      }
    }

    if (updateData.fraudWarning) {
      analytics.metrics.fraudWarnings += 1;
    }

    if (updateData.category) {
      analytics.metrics.byCategory[updateData.category] += 1;
    }

    await analytics.save();
    return analytics;
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
};

// Get analytics for date range
const getAnalytics = async (startDate, endDate) => {
  try {
    const analytics = await Analytics.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1 });

    return analytics;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
};

// Get summary statistics
const getSummaryStats = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await getAnalytics(thirtyDaysAgo, new Date());

    const summary = {
      totalConversations: 0,
      totalMessages: 0,
      totalFraudWarnings: 0,
      averageMessagesPerDay: 0,
      topCategories: {},
      platformDistribution: { mobile: 0, web: 0 },
      languageDistribution: { vi: 0, en: 0, km: 0 }
    };

    analytics.forEach(day => {
      summary.totalConversations += day.metrics.totalConversations;
      summary.totalMessages += day.metrics.totalMessages;
      summary.totalFraudWarnings += day.metrics.fraudWarnings;

      summary.platformDistribution.mobile += day.metrics.byPlatform.mobile;
      summary.platformDistribution.web += day.metrics.byPlatform.web;

      summary.languageDistribution.vi += day.metrics.byLanguage.vi;
      summary.languageDistribution.en += day.metrics.byLanguage.en;
      summary.languageDistribution.km += day.metrics.byLanguage.km;

      Object.keys(day.metrics.byCategory).forEach(category => {
        if (!summary.topCategories[category]) {
          summary.topCategories[category] = 0;
        }
        summary.topCategories[category] += day.metrics.byCategory[category];
      });
    });

    summary.averageMessagesPerDay = analytics.length > 0
      ? Math.round(summary.totalMessages / analytics.length)
      : 0;

    return summary;
  } catch (error) {
    console.error('Error getting summary stats:', error);
    return null;
  }
};

module.exports = {
  updateAnalytics,
  getAnalytics,
  getSummaryStats
};
