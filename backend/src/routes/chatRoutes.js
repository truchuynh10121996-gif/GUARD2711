const express = require('express');
const router = express.Router();
const {
  createSession,
  sendMessage,
  getConversation,
  deleteConversation
} = require('../controllers/chatController');

// @route   POST /api/chat/session
// @desc    Create new chat session
// @access  Public
router.post('/session', createSession);

// @route   POST /api/chat/message
// @desc    Send message and get AI response
// @access  Public
router.post('/message', sendMessage);

// @route   GET /api/chat/:sessionId
// @desc    Get conversation history
// @access  Public
router.get('/:sessionId', getConversation);

// @route   DELETE /api/chat/:sessionId
// @desc    Delete conversation
// @access  Public
router.delete('/:sessionId', deleteConversation);

module.exports = router;
