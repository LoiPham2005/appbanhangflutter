import axios from 'axios';
import { API_URL } from './config';

export const notificationService = {
  getAllNotifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  createNotification: async (notificationData) => {
    try {
      const response = await axios.post(`${API_URL}/notifications/add`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  updateNotification: async (id, notificationData) => {
    try {
      const response = await axios.put(`${API_URL}/notifications/${id}`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/notifications/read/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};