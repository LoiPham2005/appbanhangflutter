const modelNotification = require('../models/model_notification');
const modelUser = require('../models/model_user'); // Change from model_users to model_user

module.exports = {
    // Add notification
    add: async (req, res) => {
        try {
            const { title, message, type, data } = req.body;

            // Get all users with role 'user'
            const users = await modelUser.find({ role: 'user' });
            const notifications = [];
            const io = req.app.get('io');

            // Create one notification for each user
            for (const user of users) {
                // Kiểm tra xem thông báo tương tự đã tồn tại chưa
                const existingNotification = await modelNotification.findOne({
                    userId: user._id,
                    title,
                    message,
                    type,
                    createdAt: {
                        $gte: new Date(Date.now() - 5000) // Trong vòng 5 giây
                    }
                });

                if (!existingNotification) {
                    const notification = new modelNotification({
                        userId: user._id,
                        title,
                        message,
                        type,
                        isRead: false,
                        data: data || {}
                    });

                    const savedNotification = await notification.save();
                    notifications.push(savedNotification);

                    // Emit socket event to specific user
                    io.to(`user_${user._id}`).emit('new_notification', {
                        notification: savedNotification,
                        type
                    });
                }
            }

            res.json({
                status: 200,
                message: "Thêm thông báo thành công cho tất cả người dùng",
                data: notifications
            });

        } catch (error) {
            console.error("Error creating notification:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi thêm thông báo",
                error: error.message
            });
        }
    },

    // Get notifications by userId
    getByUserId: async (req, res) => {
        try {
            const notifications = await modelNotification
                .find({ userId: req.params.userId })
                .sort({ createdAt: -1 });
            res.json({
                status: 200,
                message: "Lấy thông báo thành công",
                data: notifications
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Lỗi lấy thông báo",
                error: error.message
            });
        }
    },

    // Mark notification as read
    markAsRead: async (req, res) => {
        try {
            const notification = await modelNotification.findByIdAndUpdate(
                req.params.id,
                { isRead: true },
                { new: true }
            );
            res.json({
                status: 200,
                message: "Đánh dấu đã đọc thành công",
                data: notification
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Lỗi đánh dấu đã đọc",
                error: error.message
            });
        }
    },

    // Get all notifications
    list: async (req, res) => {
        try {
            const notifications = await modelNotification
                .find()
                .populate('userId', 'username email avatar') // Include avatar in population
                .sort({ createdAt: -1 });

            res.json({
                status: 200,
                message: "Lấy danh sách thông báo thành công",
                data: notifications
            });
        } catch (error) {
            console.error("Error getting notifications:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi lấy danh sách thông báo",
                error: error.message
            });
        }
    },

    // Delete notification
    delete: async (req, res) => {
        try {
            const notification = await modelNotification.findByIdAndDelete(req.params.id);
            if (!notification) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy thông báo"
                });
            }

            res.json({
                status: 200,
                message: "Xóa thông báo thành công",
                data: notification
            });
        } catch (error) {
            console.error("Error deleting notification:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi xóa thông báo",
                error: error.message
            });
        }
    }
};