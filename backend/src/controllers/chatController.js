const Conversation = require('../models/Conversation');
const { generateResponse } = require('../services/geminiService');
const { updateAnalytics } = require('../services/analyticsService');
const { v4: uuidv4 } = require('uuid');

// Create new conversation session
const createSession = async (req, res) => {
  try {
    const { platform = 'mobile', metadata = {} } = req.body;

    const sessionId = uuidv4();

    const conversation = new Conversation({
      sessionId,
      platform,
      metadata
    });

    await conversation.save();

    // Update analytics
    await updateAnalytics({ conversation: true, platform });

    res.status(201).json({
      success: true,
      sessionId,
      message: 'Session created successfully'
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
      error: error.message
    });
  }
};

// Send message and get response
const sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'SessionId and message are required'
      });
    }

    // Find conversation
    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      // Create new session if not exists
      conversation = new Conversation({
        sessionId,
        platform: 'mobile'
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Get conversation history (last 10 messages)
    const conversationHistory = conversation.messages.slice(-10);

    // Generate AI response
    const aiResponse = await generateResponse(message, conversationHistory);

    // Add assistant message to conversation
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse.response,
      language: aiResponse.language,
      isFraudDetected: aiResponse.isFraud,
      riskLevel: aiResponse.riskLevel
    });

    // Update fraud warnings counter
    if (aiResponse.isFraud) {
      conversation.totalFraudWarnings += 1;
    }

    await conversation.save();

    // Update analytics
    await updateAnalytics({
      message: true,
      language: aiResponse.language,
      fraudWarning: aiResponse.isFraud
    });

    res.json({
      success: true,
      data: {
        response: aiResponse.response,
        language: aiResponse.language,
        isFraudDetected: aiResponse.isFraud,
        riskLevel: aiResponse.riskLevel,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message
    });
  }
};

// Get conversation history
const getConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: error.message
    });
  }
};

// Delete conversation
const deleteConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await Conversation.findOneAndDelete({ sessionId });

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation',
      error: error.message
    });
  }
};

module.exports = {
  createSession,
  sendMessage,
  getConversation,
  deleteConversation
};
