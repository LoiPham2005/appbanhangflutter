import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { API_URL } from '../../services/URL_API';
import NotificationHelper from '../../utils/NotificationHelper';

const NotificationScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        console.log('Setting up socket for user:', userId); // Debug log

        const socket = await notificationService.initializeSocket();
        socket.emit('join notification room', userId);

        socket.on('new_notification', (data) => {
          console.log('Received notification:', data); // Debug log
          if (data.notification.userId === userId) {
            setNotifications(prev => [data.notification, ...prev]);
          }
        });

        // Initial fetch
        fetchNotifications(userId);

      } catch (error) {
        console.error('Error setting up socket:', error);
      }
    };

    setupSocket();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      if (id) fetchNotifications(id);
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(userId);
      console.log('Fetched notifications in screen:', response);

      if (response.success) {
        setNotifications(response.data);
      } else {
        console.error('Error fetching notifications:', response.message);
      }
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(notifications.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: item.isRead ? theme.backgroundColor : '#E3F2FD' }
      ]}
      onPress={() => handleMarkAsRead(item._id)}
    >
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: theme.textColor }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: theme.textColor }]}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        {/* Nút Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>

        {/* Tiêu đề */}
        <Text style={[styles.textHeader, { color: theme.textColor }]}>
          {t('notifications.title')}
        </Text>

        {/* Placeholder để căn giữa tiêu đề */}
        <View style={styles.backButton} />
      </View>

      {/* Danh sách thông báo */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchNotifications(userId);
              }}
            />
          }
          ListEmptyComponent={() => (
            <Text style={[styles.emptyText, { color: theme.textColor }]}>
              {t('notifications.noNotifications')}
            </Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Căn giữa tiêu đề
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default NotificationScreen;
