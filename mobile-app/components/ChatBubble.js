import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/Colors';

export default function ChatBubble({ message, isUser, onSpeak }) {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'danger':
        return COLORS.status.danger;
      case 'warning':
        return COLORS.status.warning;
      case 'safe':
        return COLORS.status.safe;
      default:
        return 'transparent';
    }
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      {isUser ? (
        <View style={[styles.bubble, { backgroundColor: COLORS.chat.userBubble }]}>
          <Text style={[styles.text, { color: COLORS.chat.userText }]}>
            {message.content}
          </Text>
        </View>
      ) : (
        <View style={styles.botBubbleContainer}>
          {message.riskLevel && message.riskLevel !== 'safe' && (
            <View
              style={[
                styles.riskBadge,
                { backgroundColor: getRiskColor(message.riskLevel) },
              ]}
            >
              <Text style={styles.riskText}>
                {message.riskLevel === 'danger' ? '🚨 Nguy hiểm' : '⚠️ Cảnh báo'}
              </Text>
            </View>
          )}
          <View style={[styles.bubble, { backgroundColor: COLORS.chat.botBubble }]}>
            <Text style={[styles.text, { color: COLORS.chat.botText }]}>
              {message.content}
            </Text>
          </View>
          {onSpeak && (
            <TouchableOpacity style={styles.speakButton} onPress={onSpeak}>
              <Text style={styles.speakIcon}>🔊</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  botBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  riskBadge: {
    position: 'absolute',
    top: -10,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  riskText: {
    color: COLORS.text.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  speakButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
  },
  speakIcon: {
    fontSize: 20,
  },
});
