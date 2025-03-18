import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import ChatList from './ChatList';
import WindowChat from './WindowChat';
import './ChatsScreen.css';

export default function ChatsScreen() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  // Thêm useEffect để kiểm tra đăng nhập
  useEffect(() => {
    if (!userId) {
      console.error('User not logged in');
      // Có thể chuyển hướng về trang login
    }
  }, [userId]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <MainLayout>
      <div className="chats-container">
        {/* <h1 className="page-title">Tin nhắn</h1> */}
        {error && (
          <div className="error-message">
            Lỗi: {error.message}
          </div>
        )}
        <div className="chat-layout">
          <div className="chat-sidebar">
            <ChatList
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChat?._id}
            />
          </div>
          <div className="chat-main">
            {selectedChat ? (
              <WindowChat chat={selectedChat} userId={userId} />
            ) : (
              <div className="no-chat-selected">
                Chọn một cuộc trò chuyện để bắt đầu
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
