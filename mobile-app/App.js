import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import { chatAPI } from './services/api';
import { ttsService, sttService } from './services/speechService';
import COLORS from './constants/Colors';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const flatListRef = useRef(null);

  // Initialize session
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // Check for existing session
      let existingSessionId = await AsyncStorage.getItem('sessionId');

      if (!existingSessionId) {
        // Create new session
        const response = await chatAPI.createSession('mobile', {
          deviceInfo: Platform.OS,
        });
        existingSessionId = response.sessionId;
        await AsyncStorage.setItem('sessionId', existingSessionId);
      }

      setSessionId(existingSessionId);

      // Load conversation history
      try {
        const conversation = await chatAPI.getConversation(existingSessionId);
        if (conversation.data && conversation.data.messages) {
          setMessages(conversation.data.messages);
        }
      } catch (error) {
        console.log('No existing conversation');
      }

      // Show welcome message if no messages
      if (messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content:
              'Xin chào! 👋 Tôi là AGRIBANK DIGITAL GUARD - trợ lý AI phòng chống lừa đảo.\n\nBạn có thể:\n🔍 Mô tả tình huống đáng ngờ\n❓ Hỏi về các thủ đoạn lừa đảo\n🛡️ Nhận hướng dẫn bảo vệ tài khoản\n\nHãy kể cho tôi về tình huống bạn gặp phải nhé!',
            timestamp: new Date(),
            riskLevel: 'safe',
          },
        ]);
      }
    } catch (error) {
      console.error('Initialize Error:', error);
      Alert.alert(
        'Lỗi khởi tạo',
        'Không thể kết nối đến server. Vui lòng kiểm tra:\n1. Server backend đang chạy\n2. Địa chỉ IP trong config.js chính xác',
        [{ text: 'OK' }]
      );
    } finally {
      setIsInitializing(false);
    }
  };

  // Send message
  const handleSendMessage = async (messageText) => {
    if (!sessionId) {
      Alert.alert('Lỗi', 'Session chưa được khởi tạo');
      return;
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API
      const response = await chatAPI.sendMessage(sessionId, messageText);

      // Add bot response
      const botMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp),
        language: response.data.language,
        isFraudDetected: response.data.isFraudDetected,
        riskLevel: response.data.riskLevel,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Send Message Error:', error);
      Alert.alert(
        'Lỗi',
        'Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối và thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice recording
  const handleVoiceRecord = async (shouldStart) => {
    if (shouldStart) {
      try {
        await sttService.startRecording();
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể bắt đầu ghi âm. Vui lòng cấp quyền microphone.');
      }
    } else {
      try {
        const audioUri = await sttService.stopRecording();
        if (audioUri) {
          Alert.alert(
            'Ghi chú',
            'Chức năng chuyển giọng nói thành văn bản cần tích hợp với Google Cloud Speech-to-Text API. Hiện tại vui lòng nhập văn bản.'
          );
        }
      } catch (error) {
        console.error('Stop Recording Error:', error);
      }
    }
  };

  // Handle text-to-speech
  const handleSpeak = (message) => {
    ttsService.speak(message.content, message.language || 'vi');
  };

  // Clear conversation
  const handleClearConversation = () => {
    Alert.alert(
      'Xóa cuộc hội thoại',
      'Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              if (sessionId) {
                await chatAPI.deleteConversation(sessionId);
                await AsyncStorage.removeItem('sessionId');
              }
              setMessages([]);
              setSessionId(null);
              initializeSession();
            } catch (error) {
              console.error('Clear Error:', error);
            }
          },
        },
      ]
    );
  };

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang khởi tạo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <Header />

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isUser={item.role === 'user'}
              onSpeak={item.role === 'assistant' ? () => handleSpeak(item) : null}
            />
          )}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <TouchableOpacity style={styles.clearButton} onPress={handleClearConversation}>
          <Text style={styles.clearButtonText}>🗑️ Xóa lịch sử</Text>
        </TouchableOpacity>

        <ChatInput
          onSend={handleSendMessage}
          onVoiceRecord={handleVoiceRecord}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
});
