const express = require('express');
const router = express.Router();
const {
  getAllScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
  bulkImportScenarios
} = require('../controllers/scenarioController');

// @route   GET /api/scenarios
// @desc    Get all scenarios
// @access  Public
router.get('/', getAllScenarios);

// @route   POST /api/scenarios
// @desc    Create new scenario
// @access  Admin
router.post('/', createScenario);

// @route   PUT /api/scenarios/:id
// @desc    Update scenario
// @access  Admin
router.put('/:id', updateScenario);

// @route   DELETE /api/scenarios/:id
// @desc    Delete scenario
// @access  Admin
router.delete('/:id', deleteScenario);

// @route   POST /api/scenarios/bulk
// @desc    Bulk import scenarios
// @access  Admin
router.post('/bulk', bulkImportScenarios);

module.exports = router;
