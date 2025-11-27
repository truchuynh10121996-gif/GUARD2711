const express = require('express');
const router = express.Router();
const {
  upload,
  checkSTTAvailability,
  transcribeAudioFile,
  transcribeAndSendMessage,
} = require('../controllers/speechController');

// @route   GET /api/speech/check
// @desc    Check if Speech-to-Text is available
// @access  Public
router.get('/check', checkSTTAvailability);

// @route   POST /api/speech/transcribe
// @desc    Transcribe audio file to text
// @access  Public
router.post('/transcribe', upload.single('audio'), transcribeAudioFile);

// @route   POST /api/speech/voice-message
// @desc    Transcribe audio and send as message (all-in-one)
// @access  Public
router.post('/voice-message', upload.single('audio'), transcribeAndSendMessage);

module.exports = router;
