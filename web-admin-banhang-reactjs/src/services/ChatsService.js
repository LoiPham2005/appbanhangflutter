import axios from 'axios';
import { API_URL } from './config';

export const chatService = {
  // Lấy danh sách chat
  getChats: async (userId, page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/chat/user/${userId}`, {
        params: {
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  // Lấy tin nhắn của một cuộc hội thoại
  getMessages: async (chatId, beforeId = null, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/chat/${chatId}/messages`, {
        params: {
          beforeId,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Gửi tin nhắn
  sendMessage: async (chatId, senderId, content, type = 'text') => {
    try {
      const response = await axios.post(`${API_URL}/chat/send`, {
        chatId,
        senderId,
        content,
        type
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Tạo cuộc trò chuyện mới
  createChat: async (participants) => {
    try {
      const response = await axios.post(`${API_URL}/chat/create`, {
        participants
      });
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Đánh dấu tin nhắn đã đọc
  markAsRead: async (chatId, userId) => {
    try {
      const response = await axios.post(`${API_URL}/chat/markAsRead`, {
        chatId,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }
};