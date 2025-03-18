const modelChat = require('../models/model_chat');

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to chat system:', socket.id);

    socket.on('join chat', (chatId) => {
      if (chatId) {
        socket.join(`chat_${chatId}`);
        console.log('User joined chat room:', chatId, socket.id);
      }
    });

    socket.on('send message', async (messageData) => {
      try {
        const { chatId, senderId, content } = messageData;
        console.log('Received message:', messageData);

        const chat = await modelChat.findById(chatId)
          .populate('participants', 'username avatar');

        if (chat) {
          const newMessage = {
            sender: senderId,
            content,
            timestamp: new Date(),
            isRead: false
          };

          // Thêm tin nhắn vào chat
          chat.messages.push(newMessage);
          chat.lastMessage = newMessage;
          chat.updatedAt = new Date();
          await chat.save();

          const savedMessage = chat.messages[chat.messages.length - 1];

          // Emit to all clients in the chat room
          io.to(`chat_${chatId}`).emit('new message', {
            chatId,
            message: {
              _id: savedMessage._id,
              content: savedMessage.content,
              sender: savedMessage.sender,
              timestamp: savedMessage.timestamp,
              isRead: savedMessage.isRead
            }
          });

          console.log('Message emitted to room:', `chat_${chatId}`);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from chat:', socket.id);
    });
  });
};

module.exports = initializeSocket;