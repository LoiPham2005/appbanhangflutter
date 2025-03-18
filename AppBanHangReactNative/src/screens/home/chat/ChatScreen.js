// src/screens/chat/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';
import { chatService } from '../../../services/ChatService';
import { API_URL } from '../../../services/URL_API';
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';

const ChatScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [otherUserName, setOtherUserName] = useState(t('chat.title'));
  const { theme } = useTheme();
  const flatListRef = useRef();
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const userRole = await AsyncStorage.getItem('userRole');
        setUserId(id);
        console.log('Current user:', { id, userRole }); // Debug log

        if (userRole === 'admin') {
          // For admin, use the chat ID from route params
          if (route.params?.chatId) {
            setChatId(route.params.chatId);
            setOtherUserName(route.params.userName || 'User');
            await loadMessages(route.params.chatId);
            console.log('Admin chat loaded:', route.params.chatId);
          }
        } else {
          // Regular users need to create/get their chat with admin
          const adminResponse = await fetch(`${API_URL}/api/users/getAdmin`);
          const adminData = await adminResponse.json();
          console.log('Admin data:', adminData); // Debug log

          if (adminData.status === 200) {
            // Check if chat already exists
            const userChats = await chatService.getUserChats(id);
            let existingChat = userChats.data?.find(chat =>
              chat.participants.some(p => p._id === adminData.data._id)
            );

            if (existingChat) {
              setChatId(existingChat._id);
              await loadMessages(existingChat._id);
              console.log('Existing chat loaded:', existingChat._id);
            } else {
              // Create new chat if none exists
              const chatResponse = await chatService.createChat([id, adminData.data._id]);
              if (chatResponse.status === 200) {
                setChatId(chatResponse.data._id);
                await loadMessages(chatResponse.data._id);
                console.log('New chat created:', chatResponse.data._id);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      }
    };

    loadUserInfo();
  }, [route.params?.chatId]);

  useEffect(() => {
    const setupSocket = async () => {
      const socket = io(API_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity
      });

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        if (chatId) {
          socket.emit('join chat', chatId);
          console.log('Joined chat room:', chatId);
        }
      });

      socket.on('new message', (data) => {
        console.log('Received new message:', data);
        if (data.chatId === chatId) {
          setMessages(prev => {
            const messageExists = prev.some(msg =>
              msg._id === data.message._id
            );

            if (!messageExists) {
              const newMessage = {
                _id: data.message._id,
                content: data.message.content,
                sender: {
                  _id: data.message.sender
                },
                timestamp: new Date(data.message.timestamp)
              };

              flatListRef.current?.scrollToEnd({ animated: true });
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      });

      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    };

    setupSocket();
  }, [chatId]);

  useEffect(() => {
    if (socket && chatId) {
      console.log('Joining chat room:', chatId);
      socket.emit('join chat', chatId);

      return () => {
        socket.emit('leave chat', chatId);
      };
    }
  }, [socket, chatId]);

  const loadMessages = async (cid) => {
    try {
      const response = await chatService.getMessages(cid);
      if (response.success) {
        setMessages(response.data.messages);
        // Scroll to bottom after new messages
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !chatId || !userId || !socket) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const messageData = {
        chatId,
        senderId: userId,
        content: messageContent,
        timestamp: new Date()
      };

      // Emit through socket
      socket.emit('send message', messageData);

      // Save through API
      await chatService.sendMessage(chatId, userId, messageContent);

      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleTyping = (text) => {
    setNewMessage(text);
    if (socket && chatId) {
      socket.emit('typing', { chatId, userId });

      setTimeout(() => {
        socket.emit('stop typing', { chatId });
      }, 3000);
    }
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.sender._id === userId || item.sender === userId;
    const messageTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble
        ]}>
          <Text style={[
            styles.messageText,
            { color: isOwnMessage ? '#fff' : theme.textColor }
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.timeText,
            isOwnMessage ? styles.ownTimeText : styles.otherTimeText
          ]}>
            {messageTime}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {otherUserName}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        style={styles.messagesList}
      />

      {isTyping && (
        <Text style={styles.typingIndicator}>{t('chat.typing')}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: theme.textColor }]}
          value={newMessage}
          onChangeText={handleTyping}
          placeholder={t('chat.messageHint')}
          placeholderTextColor={theme.textColor}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Feather name="send" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messagesList: {
    flex: 1,
    padding: 16
  },
  messageContainer: {
    width: '100%',
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    elevation: 1,
    marginBottom: 4
  },
  ownBubble: {
    backgroundColor: '#2196F3',
    borderTopRightRadius: 4,
    marginLeft: '20%',
  },
  otherBubble: {
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 4,
    marginRight: '20%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    color: '#666',
    alignSelf: 'flex-end'
  },
  ownTimeText: {
    textAlign: 'right',
    marginRight: 4,
  },
  otherTimeText: {
    textAlign: 'left',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingIndicator: {
    fontSize: 12,
    color: '#666',
    padding: 8,
    fontStyle: 'italic'
  }
});

export default ChatScreen;