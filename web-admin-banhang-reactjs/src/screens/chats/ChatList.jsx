import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/ChatsService';
import './ChatList.css';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId]);

  const fetchChats = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await chatService.getChats(userId, pageNumber);
      console.log('Chats response:', response); // Debug log
      
      if (response.status === 200) {
        const formattedChats = response.data.map(chat => {
          const otherUser = chat.participants.find(p => p._id !== userId);
          return {
            ...chat,
            displayName: otherUser?.username || 'Unknown User',
            avatar: otherUser?.avatar || '/default-avatar.png'
          };
        });

        if (pageNumber === 1) {
          setChats(formattedChats);
        } else {
          setChats(prev => [...prev, ...formattedChats]);
        }
        setHasMore(formattedChats.length === 20); // Giả sử mỗi trang có 20 items
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollHeight - scrollTop === clientHeight && hasMore && !loading) {
        setPage(prev => prev + 1);
        fetchChats(page + 1);
      }
    }
  };

  const formatLastMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChatSelect = (chat) => {
    console.log('Selected chat:', chat); // Debug log
    onSelectChat(chat);
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Cuộc trò chuyện</h2>
      </div>
      <div 
        className="chat-list-content" 
        ref={listRef}
        onScroll={handleScroll}
      >
        {loading && page === 1 ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <>
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${selectedChatId === chat._id ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat)}
              >
                <img
                  src={chat.avatar}
                  alt={chat.displayName}
                  className="chat-avatar"
                />
                <div className="chat-info">
                  <div className="chat-name">{chat.displayName}</div>
                  {chat.lastMessage && (
                    <div className="chat-last-message">
                      <span className="message-content">
                        {chat.lastMessage.content}
                      </span>
                      <span className="message-time">
                        {formatLastMessageTime(chat.lastMessage.timestamp)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && page > 1 && (
              <div className="loading-more">Đang tải thêm...</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatList;