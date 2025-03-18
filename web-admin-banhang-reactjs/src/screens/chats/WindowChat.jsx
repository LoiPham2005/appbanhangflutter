import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/ChatsService';
import io from 'socket.io-client';
import { API_URL } from '../../services/config';
import './WindowChat.css';

const WindowChat = ({ chat, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null); // Thêm dòng này
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    });

    if (chat?._id) {
      // Join chat room
      socketRef.current.emit('join chat', chat._id);
      console.log('Joined chat room:', chat._id);

      // Listen for new messages
      socketRef.current.on('new message', (data) => {
        console.log('Received new message:', data);
        if (data.chatId === chat._id) {
          setMessages(prev => {
            // Check for duplicate messages
            const messageExists = prev.some(msg =>
              msg._id === data.message._id
            );

            if (!messageExists) {
              // Format the new message
              const newMessage = {
                _id: data.message._id,
                content: data.message.content,
                sender: {
                  _id: data.message.sender,
                  username: chat.participants.find(p => p._id === data.message.sender)?.username
                },
                timestamp: new Date(data.message.timestamp)
              };

              // Scroll to bottom after adding new message
              setTimeout(scrollToBottom, 100);
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      });

      // Initial fetch
      fetchMessages();
      markMessagesAsRead();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new message');
        socketRef.current.disconnect();
      }
    };
  }, [chat?._id]);

  const fetchMessages = async () => {
    if (!chat?._id) return;

    try {
      setLoading(true);
      const response = await chatService.getMessages(chat._id);
      if (response.status === 200) {
        setMessages(response.data.messages || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await chatService.markAsRead(chat._id, userId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageContent = newMessage.trim();
    if (!messageContent) return;

    try {
      setNewMessage('');

      const messageData = {
        chatId: chat._id,
        senderId: userId,
        content: messageContent,
        timestamp: new Date()
      };

      // Thêm tin nhắn vào UI ngay lập tức
      setMessages(prev => [...prev, {
        _id: Date.now(), // Temporary ID
        content: messageContent,
        sender: {
          _id: userId
        },
        timestamp: new Date()
      }]);

      // Scroll to bottom
      setTimeout(scrollToBottom, 100);

      // Emit through socket
      socketRef.current.emit('send message', messageData);

      // Save to database through API
      await chatService.sendMessage(chat._id, userId, messageContent);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="window-chat">
      {chat ? (
        <>
          <div className="chat-header">
            <img
              src={chat.participants[0]?.avatar || '/default-avatar.png'}
              alt="avatar"
              className="chat-avatar"
            />
            <div className="chat-info">
              <div className="chat-name">
                {chat.participants[0]?.username || 'Unknown User'}
              </div>
            </div>
          </div>

          <div className="messages-container" ref={messagesContainerRef}>
            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : (
              <div className="messages">
                {messages.map((message) => (
                  <div
                    key={message._id || Date.now()}
                    className={`message ${message.sender?._id === userId ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="message-input-container">
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                autoComplete="off"
              />
              <button type="submit">Gửi</button>
            </form>
          </div>
        </>
      ) : (
        <div className="no-chat-selected">
          Chọn một cuộc trò chuyện để bắt đầu
        </div>
      )}
    </div>
  );
};

export default WindowChat;