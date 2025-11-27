import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/Colors';

export default function ChatInput({ onSend, onVoiceRecord, isLoading }) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleVoicePress = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      await onVoiceRecord(false);
    } else {
      // Start recording
      setIsRecording(true);
      await onVoiceRecord(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập câu hỏi hoặc mô tả tình huống..."
          placeholderTextColor={COLORS.text.light}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          editable={!isLoading && !isRecording}
        />

        <TouchableOpacity
          style={[
            styles.voiceButton,
            isRecording && { backgroundColor: COLORS.status.danger },
          ]}
          onPress={handleVoicePress}
          disabled={isLoading}
        >
          <Text style={styles.voiceIcon}>{isRecording ? '⏹️' : '🎤'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendButton, (!message.trim() || isLoading) && styles.disabledButton]}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.text.white} size="small" />
          ) : (
            <LinearGradient
              colors={[COLORS.primary.pink, COLORS.primary.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendGradient}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>

      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Đang ghi âm...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    color: COLORS.text.primary,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  voiceIcon: {
    fontSize: 22,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 8,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  sendGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
    color: COLORS.text.white,
    fontWeight: 'bold',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.status.danger,
    marginRight: 8,
  },
  recordingText: {
    color: COLORS.status.danger,
    fontSize: 14,
    fontWeight: '500',
  },
});
