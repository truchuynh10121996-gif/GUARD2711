import axios from 'axios';
import { API_CONFIG } from '../constants/config';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.message);
    if (error.response) {
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Chat API
export const chatAPI = {
  // Create new session
  createSession: async (platform = 'mobile', metadata = {}) => {
    try {
      const response = await api.post('/chat/session', { platform, metadata });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send message
  sendMessage: async (sessionId, message) => {
    try {
      const response = await api.post('/chat/message', { sessionId, message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get conversation history
  getConversation: async (sessionId) => {
    try {
      const response = await api.get(`/chat/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete conversation
  deleteConversation: async (sessionId) => {
    try {
      const response = await api.delete(`/chat/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Scenarios API
export const scenariosAPI = {
  // Get all scenarios
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/scenarios', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
