import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { chatService } from '../../../services/ChatService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../services/URL_API';
import { useTranslation } from 'react-i18next';

const ChatListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const loadUsers = async () => {
    try {
      const adminId = await AsyncStorage.getItem('userId');
      // Fetch all users
      const response = await fetch(`${API_URL}/api/users/list`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Filter out admin accounts and format user data
        const userAccounts = data
          .filter(user => user.role === 'user')
          .map(user => ({
            id: user._id,
            username: user.username || 'Unknown User',
            avatar: user.avatar,
            email: user.email
          }));
        setUsers(userAccounts);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const handleChatPress = async (user) => {
    try {
      const adminId = await AsyncStorage.getItem('userId');
      
      // Check if chat already exists
      const existingChatsResponse = await chatService.getUserChats(adminId);
      let existingChat = existingChatsResponse.data?.find(chat => 
        chat.participants.some(p => p._id === user.id)
      );

      let chatId;
      if (existingChat) {
        chatId = existingChat._id;
      } else {
        // Create new chat if none exists
        const createChatResponse = await chatService.createChat([adminId, user.id]);
        if (createChatResponse.status === 200) {
          chatId = createChatResponse.data._id;
        }
      }

      // Navigate to chat screen
      navigation.navigate('Chat', {
        chatId,
        userName: user.username,
        userId: user.id
      });
    } catch (error) {
      console.error('Error navigating to chat:', error);
      Alert.alert('Lỗi', 'Không thể mở cuộc trò chuyện');
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.userItem, { backgroundColor: theme.backgroundColor }]}
      onPress={() => handleChatPress(item)}
    >
      <Image
        source={
          item.avatar 
            ? { uri: item.avatar } 
            : require('../../../../assets/default-avatar.png')
        }
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.textColor }]}>
          {item.username}
        </Text>
        <Text style={styles.userEmail}>
          {item.email}
        </Text>
      </View>
      <Feather name="message-circle" size={24} color={theme.textColor} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {t('chat.userList')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadUsers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  userItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  userEmail: {
    fontSize: 14,
    color: '#666'
  }
});

export default ChatListScreen;