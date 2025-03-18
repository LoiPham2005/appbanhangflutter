import { API_URL } from './URL_API';

export const chatService = {
    createChat: async (participants) => {
        try {
            const response = await fetch(`${API_URL}/api/chat/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ participants })
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating chat:', error);
            throw error;
        }
    },

    sendMessage: async (chatId, senderId, content, type = 'text') => {
        try {
            console.log('Sending message:', { chatId, senderId, content }); // Debug log
            const response = await fetch(`${API_URL}/api/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId,
                    senderId,
                    content,
                    type,
                    timestamp: new Date().toISOString()
                })
            });
            const data = await response.json();
            console.log('Send message response:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    getMessages: async (chatId) => {
        try {
            const response = await fetch(`${API_URL}/api/chat/${chatId}/messages`);
            const data = await response.json();
            return {
                success: data.status === 200,
                data: data.data
            };
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    },

    getUserChats: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/chat/user/${userId}`);
            const data = await response.json();
            if (data.status === 200) {
                return {
                    success: true,
                    data: data.data
                };
            } else {
                return {
                    success: false,
                    message: data.message
                };
            }
        } catch (error) {
            console.error('Error getting user chats:', error);
            throw error;
        }
    },

    markAsRead: async (chatId, userId) => {
        try {
            const response = await fetch(`${API_URL}/api/chat/markAsRead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId, userId })
            });
            return await response.json();
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    }
};