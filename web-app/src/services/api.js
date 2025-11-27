import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const chatAPI = {
  createSession: async (platform = 'web', metadata = {}) => {
    const response = await api.post('/chat/session', { platform, metadata });
    return response.data;
  },

  sendMessage: async (sessionId, message) => {
    const response = await api.post('/chat/message', { sessionId, message });
    return response.data;
  },

  getConversation: async (sessionId) => {
    const response = await api.get(`/chat/${sessionId}`);
    return response.data;
  },

  deleteConversation: async (sessionId) => {
    const response = await api.delete(`/chat/${sessionId}`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },

  getFraudStats: async () => {
    const response = await api.get('/analytics/fraud');
    return response.data;
  },
};

// Scenarios API
export const scenariosAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/scenarios', { params: filters });
    return response.data;
  },

  create: async (scenario) => {
    const response = await api.post('/scenarios', scenario);
    return response.data;
  },

  update: async (id, scenario) => {
    const response = await api.put(`/scenarios/${id}`, scenario);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/scenarios/${id}`);
    return response.data;
  },

  bulkImport: async (scenarios) => {
    const response = await api.post('/scenarios/bulk', { scenarios });
    return response.data;
  },
};

export default api;
