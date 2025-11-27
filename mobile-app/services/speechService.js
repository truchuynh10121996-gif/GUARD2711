import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import axios from 'axios';
import { API_CONFIG } from '../constants/config';

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

// Speech-to-Text Service (using Google Cloud via backend)
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

  // Check if STT is available on backend
  async checkSTTAvailability() {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/speech/check`);
      return response.data.available;
    } catch (error) {
      console.error('Check STT Error:', error);
      return false;
    }
  }

  // Transcribe audio file
  async transcribeAudio(audioUri, languageCode = 'vi-VN') {
    try {
      console.log('📤 Uploading audio for transcription...');

      // Create form data
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });
      formData.append('languageCode', languageCode);

      // Upload to backend
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/speech/transcribe`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 seconds
        }
      );

      if (response.data.success) {
        console.log('✅ Transcription:', response.data.transcription);
        return response.data.transcription;
      } else {
        throw new Error(response.data.message || 'Transcription failed');
      }
    } catch (error) {
      console.error('Transcribe Error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to transcribe audio');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  // Record and transcribe (all-in-one)
  async recordAndTranscribe(sessionId, languageCode = 'vi-VN') {
    try {
      // Start recording
      await this.startRecording();

      // Wait for user to stop (handled externally)
      // This method should be called after stopRecording()

      return true;
    } catch (error) {
      console.error('Record Error:', error);
      throw error;
    }
  }

  // Upload recorded audio and get AI response directly
  async sendVoiceMessage(audioUri, sessionId, languageCode = 'vi-VN') {
    try {
      console.log('📤 Sending voice message...');

      // Create form data
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'voice-message.m4a',
      });
      formData.append('sessionId', sessionId);
      formData.append('languageCode', languageCode);

      // Upload to backend (transcribe + AI response)
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/speech/voice-message`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds for AI processing
        }
      );

      if (response.data.success) {
        console.log('✅ Voice message processed');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Voice message failed');
      }
    } catch (error) {
      console.error('Send Voice Message Error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to process voice message');
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
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
