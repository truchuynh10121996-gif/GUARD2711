const speech = require('@google-cloud/speech');
const fs = require('fs');

// Initialize Google Cloud Speech client
let speechClient = null;

const initializeSpeechClient = () => {
  try {
    // Method 1: Using service account key file
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      speechClient = new speech.SpeechClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
      console.log('✅ Google Cloud Speech initialized with credentials file');
    }
    // Method 2: Using environment variable JSON
    else if (process.env.GOOGLE_CLOUD_CREDENTIALS_JSON) {
      const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON);
      speechClient = new speech.SpeechClient({
        credentials: credentials,
      });
      console.log('✅ Google Cloud Speech initialized with JSON credentials');
    }
    // Method 3: Default credentials (for Google Cloud environment)
    else {
      speechClient = new speech.SpeechClient();
      console.log('✅ Google Cloud Speech initialized with default credentials');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Google Cloud Speech:', error.message);
    speechClient = null;
  }
};

// Initialize on module load
initializeSpeechClient();

/**
 * Transcribe audio to text using Google Cloud Speech-to-Text
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} languageCode - Language code (vi-VN, en-US, km-KH)
 * @returns {Promise<string>} Transcribed text
 */
const transcribeAudio = async (audioBuffer, languageCode = 'vi-VN') => {
  try {
    if (!speechClient) {
      throw new Error('Speech client not initialized. Please configure Google Cloud credentials.');
    }

    // Convert audio to base64
    const audioBytes = audioBuffer.toString('base64');

    // Configure request
    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: languageCode,
        enableAutomaticPunctuation: true,
        model: 'default',
        useEnhanced: true,
      },
    };

    // Perform speech recognition
    const [response] = await speechClient.recognize(request);

    if (!response.results || response.results.length === 0) {
      return '';
    }

    // Get transcription
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    console.log('✅ Transcription successful:', transcription.substring(0, 50) + '...');
    return transcription;

  } catch (error) {
    console.error('❌ Transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};

/**
 * Transcribe audio file from path
 * @param {string} filePath - Path to audio file
 * @param {string} languageCode - Language code
 * @returns {Promise<string>} Transcribed text
 */
const transcribeAudioFile = async (filePath, languageCode = 'vi-VN') => {
  try {
    const audioBuffer = fs.readFileSync(filePath);
    return await transcribeAudio(audioBuffer, languageCode);
  } catch (error) {
    console.error('❌ File transcription error:', error);
    throw error;
  }
};

/**
 * Detect language from audio
 * @param {Buffer} audioBuffer - Audio file buffer
 * @returns {Promise<string>} Detected language code
 */
const detectLanguageFromAudio = async (audioBuffer) => {
  try {
    if (!speechClient) {
      return 'vi-VN'; // Default fallback
    }

    const audioBytes = audioBuffer.toString('base64');

    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'vi-VN',
        alternativeLanguageCodes: ['en-US', 'km-KH'],
        enableAutomaticPunctuation: true,
      },
    };

    const [response] = await speechClient.recognize(request);

    if (response.results && response.results.length > 0) {
      return response.results[0].languageCode || 'vi-VN';
    }

    return 'vi-VN';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'vi-VN'; // Default fallback
  }
};

/**
 * Check if Speech-to-Text is available
 * @returns {boolean}
 */
const isSpeechToTextAvailable = () => {
  return speechClient !== null;
};

module.exports = {
  transcribeAudio,
  transcribeAudioFile,
  detectLanguageFromAudio,
  isSpeechToTextAvailable,
  initializeSpeechClient,
};
