const modelNotification = require('../models/model_notification');

const initializeNotificationSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to notification system:', socket.id);

    socket.on('join notification room', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log('User joined notification room:', userId, socket.id);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = initializeNotificationSocket;