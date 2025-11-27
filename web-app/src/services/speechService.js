// Web Speech API Service for browser-based STT
class WebSpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = this.checkSupport();
  }

  // Check if Web Speech API is supported
  checkSupport() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  // Initialize recognition
  initialize(language = 'vi-VN') {
    if (!this.isSupported) {
      throw new Error('Web Speech API not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = language;

    console.log('✅ Web Speech API initialized');
  }

  // Start listening
  async startListening(language = 'vi-VN', onResult, onError) {
    try {
      if (!this.isSupported) {
        throw new Error('Speech recognition not supported. Please use Chrome or Edge.');
      }

      this.initialize(language);

      return new Promise((resolve, reject) => {
        this.recognition.onstart = () => {
          this.isListening = true;
          console.log('🎤 Listening...');
        };

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;

          console.log('✅ Transcription:', transcript);
          console.log('📊 Confidence:', confidence);

          if (onResult) {
            onResult(transcript, confidence);
          }

          resolve(transcript);
        };

        this.recognition.onerror = (event) => {
          console.error('❌ Recognition error:', event.error);
          this.isListening = false;

          if (onError) {
            onError(event.error);
          }

          reject(new Error(event.error));
        };

        this.recognition.onend = () => {
          this.isListening = false;
          console.log('⏹️ Recognition ended');
        };

        this.recognition.start();
      });
    } catch (error) {
      console.error('Start listening error:', error);
      throw error;
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Check if currently listening
  getListeningStatus() {
    return this.isListening;
  }

  // Get supported status
  getSupported() {
    return this.isSupported;
  }
}

// Export singleton instance
export const webSpeechService = new WebSpeechService();

export default webSpeechService;
