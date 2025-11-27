const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { transcribeAudio, isSpeechToTextAvailable } = require('../services/speechService');
const { generateResponse } = require('../services/geminiService');
const { updateAnalytics } = require('../services/analyticsService');
const Conversation = require('../models/Conversation');

// Configure multer for audio file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `audio-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /wav|mp3|m4a|webm|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed (wav, mp3, m4a, webm, ogg)'));
    }
  },
});

// Check STT availability
const checkSTTAvailability = async (req, res) => {
  try {
    const isAvailable = isSpeechToTextAvailable();

    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable
        ? 'Speech-to-Text is available'
        : 'Speech-to-Text is not configured. Please set up Google Cloud credentials.',
    });
  } catch (error) {
    console.error('Check STT error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check STT availability',
      error: error.message,
    });
  }
};

// Transcribe audio to text
const transcribeAudioFile = async (req, res) => {
  try {
    if (!isSpeechToTextAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'Speech-to-Text service is not available. Please configure Google Cloud credentials.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded',
      });
    }

    const { languageCode = 'vi-VN' } = req.body;
    const audioFilePath = req.file.path;

    console.log('📝 Transcribing audio file:', audioFilePath);

    // Read audio file
    const audioBuffer = fs.readFileSync(audioFilePath);

    // Transcribe
    const transcription = await transcribeAudio(audioBuffer, languageCode);

    // Delete uploaded file after processing
    fs.unlinkSync(audioFilePath);

    if (!transcription || transcription.trim() === '') {
      return res.json({
        success: false,
        message: 'No speech detected in audio',
        transcription: '',
      });
    }

    res.json({
      success: true,
      transcription: transcription,
      language: languageCode,
    });

  } catch (error) {
    console.error('Transcribe audio error:', error);

    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to transcribe audio',
      error: error.message,
    });
  }
};

// Transcribe and send message (all-in-one)
const transcribeAndSendMessage = async (req, res) => {
  try {
    if (!isSpeechToTextAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'Speech-to-Text service is not available',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded',
      });
    }

    const { sessionId, languageCode = 'vi-VN' } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'SessionId is required',
      });
    }

    const audioFilePath = req.file.path;

    console.log('🎤 Processing voice message for session:', sessionId);

    // Transcribe audio
    const audioBuffer = fs.readFileSync(audioFilePath);
    const transcription = await transcribeAudio(audioBuffer, languageCode);

    // Delete uploaded file
    fs.unlinkSync(audioFilePath);

    if (!transcription || transcription.trim() === '') {
      return res.json({
        success: false,
        message: 'No speech detected in audio',
      });
    }

    console.log('✅ Transcription:', transcription);

    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        platform: 'mobile',
      });
    }

    // Add user message (transcribed)
    conversation.messages.push({
      role: 'user',
      content: transcription,
    });

    // Get conversation history
    const conversationHistory = conversation.messages.slice(-10);

    // Generate AI response
    const aiResponse = await generateResponse(transcription, conversationHistory);

    // Add assistant message
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse.response,
      language: aiResponse.language,
      isFraudDetected: aiResponse.isFraud,
      riskLevel: aiResponse.riskLevel,
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
      fraudWarning: aiResponse.isFraud,
    });

    res.json({
      success: true,
      data: {
        transcription: transcription,
        response: aiResponse.response,
        language: aiResponse.language,
        isFraudDetected: aiResponse.isFraud,
        riskLevel: aiResponse.riskLevel,
        timestamp: new Date(),
      },
    });

  } catch (error) {
    console.error('Transcribe and send error:', error);

    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process voice message',
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  checkSTTAvailability,
  transcribeAudioFile,
  transcribeAndSendMessage,
};
