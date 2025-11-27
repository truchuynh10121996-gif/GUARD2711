import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// Text-to-Speech Service
export class TTSService {
  constructor() {
    this.isSpeaking = false;
  }

  // Speak text with language detection
  async speak(text, language = 'vi-VN') {
    try {
      // Stop any ongoing speech
      await this.stop();

      // Language mapping
      const languageMap = {
        vi: 'vi-VN',
        en: 'en-US',
        km: 'km-KH',
      };

      const voiceLanguage = languageMap[language] || language;

      // Speech options
      const options = {
        language: voiceLanguage,
        pitch: 1.0,
        rate: 0.9,
        onStart: () => {
          this.isSpeaking = true;
          console.log('🔊 TTS Started');
        },
        onDone: () => {
          this.isSpeaking = false;
          console.log('✅ TTS Completed');
        },
        onStopped: () => {
          this.isSpeaking = false;
          console.log('⏸️ TTS Stopped');
        },
        onError: (error) => {
          this.isSpeaking = false;
          console.error('❌ TTS Error:', error);
        },
      };

      await Speech.speak(text, options);
    } catch (error) {
      console.error('TTS Error:', error);
      this.isSpeaking = false;
    }
  }

  // Stop speaking
  async stop() {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        this.isSpeaking = false;
      }
    } catch (error) {
      console.error('Stop TTS Error:', error);
    }
  }

  // Check if speaking
  getSpeakingStatus() {
    return this.isSpeaking;
  }
}

// Speech-to-Text Service (using device's built-in)
export class STTService {
  constructor() {
    this.recording = null;
    this.isRecording = false;
  }

  // Request permissions
  async requestPermissions() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Permission Error:', error);
      return false;
    }
  }

  // Start recording
  async startRecording() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      console.log('🎤 Recording started');
    } catch (error) {
      console.error('Start Recording Error:', error);
      throw error;
    }
  }

  // Stop recording
  async stopRecording() {
    try {
      if (!this.recording) {
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();

      this.isRecording = false;
      this.recording = null;

      console.log('✅ Recording stopped:', uri);
      return uri;
    } catch (error) {
      console.error('Stop Recording Error:', error);
      return null;
    }
  }

  // Get recording status
  getRecordingStatus() {
    return this.isRecording;
  }
}

// Export singleton instances
export const ttsService = new TTSService();
export const sttService = new STTService();

export default {
  ttsService,
  sttService,
  TTSService,
  STTService,
};
