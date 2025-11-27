const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getFraudStats
} = require('../controllers/analyticsController');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Admin
router.get('/dashboard', getDashboardAnalytics);

// @route   GET /api/analytics/fraud
// @desc    Get fraud statistics
// @access  Admin
router.get('/fraud', getFraudStats);

module.exports = router;
