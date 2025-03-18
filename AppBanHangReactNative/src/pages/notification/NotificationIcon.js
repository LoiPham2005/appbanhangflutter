// NotificationIcon.js
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { notificationService } from '../../services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../../context/ThemeContext'; // Thêm import này

const NotificationIcon = ({ navigation }) => {
  const { theme } = useTheme(); // Thêm hook useTheme
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await notificationService.getNotifications(userId);
      if (response.success) {
        const unread = response.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
        await Notifications.setBadgeCountAsync(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    const initializeNotifications = async () => {
      const socket = await notificationService.initializeSocket();
      
      socket.on('notification received', (notification) => {
        fetchNotifications();
      });
      
      fetchNotifications();
    };

    initializeNotifications();

    return () => {
      const socket = notificationService.getSocket();
      if (socket) {
        socket.off('notification received');
      }
    };
  }, []);

  // Listen for focus events
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotifications();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Notifications')}
      style={styles.container}
    >
      <View style={{ padding: 5 }}>
        <Feather name="bell" size={24} color={theme.textColor} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 15
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  }
});

export default NotificationIcon;