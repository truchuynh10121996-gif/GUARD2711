import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import '../styles/Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      let existingSessionId = localStorage.getItem('webSessionId');

      if (!existingSessionId) {
        const response = await chatAPI.createSession('web', {
          userAgent: navigator.userAgent,
        });
        existingSessionId = response.sessionId;
        localStorage.setItem('webSessionId', existingSessionId);
      }

      setSessionId(existingSessionId);

      // Load history
      try {
        const conversation = await chatAPI.getConversation(existingSessionId);
        if (conversation.data && conversation.data.messages) {
          setMessages(conversation.data.messages);
        }
      } catch (error) {
        console.log('No existing conversation');
      }

      // Welcome message
      if (messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content:
              'Xin chào! 👋 Tôi là AGRIBANK DIGITAL GUARD - trợ lý AI phòng chống lừa đảo.\\n\\nBạn có thể:\\n🔍 Mô tả tình huống đáng ngờ\\n❓ Hỏi về các thủ đoạn lừa đảo\\n🛡️ Nhận hướng dẫn bảo vệ tài khoản\\n\\nHãy kể cho tôi về tình huống bạn gặp phải nhé!',
            timestamp: new Date(),
            riskLevel: 'safe',
          },
        ]);
      }
    } catch (error) {
      console.error('Initialize Error:', error);
      alert('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(sessionId, inputMessage);

      const botMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp),
        language: response.data.language,
        isFraudDetected: response.data.isFraudDetected,
        riskLevel: response.data.riskLevel,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Send Error:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text, language = 'vi-VN') => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleClearChat = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện?')) {
      try {
        if (sessionId) {
          await chatAPI.deleteConversation(sessionId);
          localStorage.removeItem('webSessionId');
        }
        setMessages([]);
        setSessionId(null);
        initializeSession();
      } catch (error) {
        console.error('Clear Error:', error);
      }
    }
  };

  const getRiskBadge = (riskLevel) => {
    if (riskLevel === 'danger') {
      return <span className="risk-badge danger">🚨 Nguy hiểm</span>;
    } else if (riskLevel === 'warning') {
      return <span className="risk-badge warning">⚠️ Cảnh báo</span>;
    }
    return null;
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>💬 Chatbot</h2>
        <button className="clear-btn" onClick={handleClearChat}>
          🗑️ Xóa lịch sử
        </button>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.role === 'assistant' && getRiskBadge(msg.riskLevel)}
            <div className="message-content">
              <p>{msg.content}</p>
            </div>
            {msg.role === 'assistant' && (
              <button
                className="speak-btn"
                onClick={() => handleSpeak(msg.content, msg.language || 'vi-VN')}
              >
                {isSpeaking ? '⏹️' : '🔊'}
              </button>
            )}
            <span className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Nhập câu hỏi hoặc mô tả tình huống..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={!inputMessage.trim() || isLoading}>
          ➤
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
