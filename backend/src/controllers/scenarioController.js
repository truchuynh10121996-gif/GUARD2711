const Scenario = require('../models/Scenario');

// Get all scenarios
const getAllScenarios = async (req, res) => {
  try {
    const { language, category, isActive } = req.query;

    const filter = {};
    if (language) filter.language = language;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const scenarios = await Scenario.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: scenarios.length,
      data: scenarios
    });
  } catch (error) {
    console.error('Get scenarios error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scenarios',
      error: error.message
    });
  }
};

// Create new scenario
const createScenario = async (req, res) => {
  try {
    const scenario = new Scenario(req.body);
    await scenario.save();

    res.status(201).json({
      success: true,
      data: scenario,
      message: 'Scenario created successfully'
    });
  } catch (error) {
    console.error('Create scenario error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create scenario',
      error: error.message
    });
  }
};

// Update scenario
const updateScenario = async (req, res) => {
  try {
    const { id } = req.params;

    const scenario = await Scenario.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      data: scenario,
      message: 'Scenario updated successfully'
    });
  } catch (error) {
    console.error('Update scenario error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update scenario',
      error: error.message
    });
  }
};

// Delete scenario
const deleteScenario = async (req, res) => {
  try {
    const { id } = req.params;

    const scenario = await Scenario.findByIdAndDelete(id);

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    console.error('Delete scenario error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete scenario',
      error: error.message
    });
  }
};

// Bulk import scenarios
const bulkImportScenarios = async (req, res) => {
  try {
    const { scenarios } = req.body;

    if (!Array.isArray(scenarios)) {
      return res.status(400).json({
        success: false,
        message: 'Scenarios must be an array'
      });
    }

    const result = await Scenario.insertMany(scenarios);

    res.status(201).json({
      success: true,
      count: result.length,
      message: `${result.length} scenarios imported successfully`
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import scenarios',
      error: error.message
    });
  }
};

module.exports = {
  getAllScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
  bulkImportScenarios
};
