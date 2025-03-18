import { API_URL } from './URL_API';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationHelper } from '../utils/NotificationHelper';

let socket = null;

export const notificationService = {
  initializeSocket: async () => {
    if (!socket) {
      socket = io(API_URL);
      const userId = await AsyncStorage.getItem('userId');

      if (userId) {
        console.log('Joining notification room for user:', userId);
        socket.emit('join notification room', userId);

        socket.on('new_notification', async (data) => {
          console.log('Received new notification:', data);

          // Check if notification is meant for this user
          if (data.notification.userId === userId) {
            if (socket.notificationCallback) {
              socket.notificationCallback(data);
            }

            await NotificationHelper.showLocalNotification(
              data.notification.title,
              data.notification.message,
              data.notification.data
            );
          }
        });
      }
    }
    return socket;
  },

  getSocket: () => {
    return socket;
  },

  createNotification: async (notificationData) => {
    try {
      if (!notificationData.userId) {
        throw new Error('userId is required');
      }

      if (!socket) {
        await notificationService.initializeSocket();
      }

      socket.emit('new notification', notificationData);

      return {
        success: true,
        message: 'Notification sent'
      };
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  getNotifications: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/user/${userId}`);
      const data = await response.json();
      console.log('Fetched notifications:', data);

      if (data.status === 200) {
        return {
          success: true,
          data: data.data || [],
          message: data.message
        };
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        data: [],
        message: error.message
      };
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/read/${notificationId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      return {
        success: data.status === 200,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Thêm method để đăng ký callback
  setNotificationCallback: (callback) => {
    if (socket) {
      socket.notificationCallback = callback;
    }
  }
};