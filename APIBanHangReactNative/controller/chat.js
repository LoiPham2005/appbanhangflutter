const modelChat = require('../models/model_chat');
const modelUser = require('../models/model_user');

module.exports = {
    // Tạo cuộc trò chuyện mới
    createChat: async (req, res) => {
        try {
            const { participants } = req.body;
            
            // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
            const existingChat = await modelChat.findOne({
                participants: { $all: participants }
            });

            if (existingChat) {
                return res.json({
                    status: 200,
                    message: "Cuộc trò chuyện đã tồn tại",
                    data: existingChat
                });
            }

            const newChat = new modelChat({
                participants,
                messages: []
            });

            const result = await newChat.save();
            res.json({
                status: 200,
                message: "Tạo cuộc trò chuyện thành công",
                data: result
            });
        } catch (error) {
            console.error("Error creating chat:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi tạo cuộc trò chuyện",
                error: error.message
            });
        }
    },

    // Gửi tin nhắn
    sendMessage: async (req, res) => {
        try {
            const { chatId, senderId, content, type = 'text' } = req.body;

            const chat = await modelChat.findById(chatId);
            if (!chat) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy cuộc trò chuyện"
                });
            }

            const newMessage = {
                sender: senderId,
                content,
                type,
                timestamp: new Date(),
                isRead: false
            };

            chat.messages.push(newMessage);
            chat.lastMessage = newMessage;
            chat.updatedAt = new Date();

            const result = await chat.save();
            res.json({
                status: 200,
                message: "Gửi tin nhắn thành công",
                data: result
            });
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi gửi tin nhắn",
                error: error.message
            });
        }
    },

    // Lấy danh sách tin nhắn của một cuộc trò chuyện
    getMessages: async (req, res) => {
        try {
            const chatId = req.params.chatId;
            const chat = await modelChat.findById(chatId)
                .populate('participants', 'username avatar')
                .populate('messages.sender', 'username avatar');

            if (!chat) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy cuộc trò chuyện"
                });
            }

            res.json({
                status: 200,
                message: "Lấy tin nhắn thành công",
                data: chat
            });
        } catch (error) {
            console.error("Error getting messages:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi lấy tin nhắn",
                error: error.message
            });
        }
    },

    // Lấy danh sách cuộc trò chuyện của một người dùng
    getUserChats: async (req, res) => {
        try {
            const userId = req.params.userId;
            const chats = await modelChat.find({
                participants: userId
            })
            .populate({
                path: 'participants',
                select: 'username avatar _id',
                model: 'User'
            })
            .populate({
                path: 'lastMessage.sender',
                select: 'username avatar _id',
                model: 'User'
            })
            .sort({ updatedAt: -1 });

            // Thêm debug log
            console.log('Found chats:', chats);

            res.json({
                status: 200,
                message: "Lấy danh sách cuộc trò chuyện thành công",
                data: chats
            });
        } catch (error) {
            console.error("Error getting user chats:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi lấy danh sách cuộc trò chuyện",
                error: error.message
            });
        }
    },

    // Đánh dấu tin nhắn đã đọc
    markAsRead: async (req, res) => {
        try {
            const { chatId, userId } = req.body;
            
            const chat = await modelChat.findById(chatId);
            if (!chat) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy cuộc trò chuyện"
                });
            }

            chat.messages.forEach(message => {
                if (message.sender.toString() !== userId) {
                    message.isRead = true;
                }
            });

            const result = await chat.save();
            res.json({
                status: 200,
                message: "Đánh dấu đã đọc thành công",
                data: result
            });
        } catch (error) {
            console.error("Error marking messages as read:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi đánh dấu đã đọc",
                error: error.message
            });
        }
    }
};