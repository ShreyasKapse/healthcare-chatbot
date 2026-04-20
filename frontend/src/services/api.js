import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get auth token from Clerk
const getAuthToken = async () => {
  if (window.Clerk && window.Clerk.session) {
    try {
      const token = await window.Clerk.session.getToken();
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }
  return null;
};

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API service functions
export const chatAPI = {
  // Send a message to the chatbot
  sendMessage: async (message, conversation_id = null) => {
    try {
      const response = await api.post('/chat/send', {
        message,
        conversation_id
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get conversation history for authenticated user
  getConversationHistory: async () => {
    try {
      const response = await api.get('/chat/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  },

  // Get messages for a specific conversation
  getConversationMessages: async (conversation_id) => {
    try {
      const response = await api.get(`/chat/messages/${conversation_id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.post('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Health check (public)
export const healthCheck = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
};

export default api;
