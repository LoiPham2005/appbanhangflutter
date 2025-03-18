const modelSearchHistory = require('../models/model_search_history');

module.exports = {
    // Add search history
    addSearchHistory: async (req, res) => {
        try {
            const { userId, keyword } = req.body;
            
            if (!userId || !keyword) {
                return res.status(400).json({
                    status: 400,
                    message: "UserId và keyword là bắt buộc"
                });
            }

            const searchHistory = new modelSearchHistory({
                userId,
                keyword
            });

            const result = await searchHistory.save();
            res.json({
                status: 200,
                message: "Đã lưu lịch sử tìm kiếm",
                data: result
            });
        } catch (error) {
            console.error("Error saving search history:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi lưu lịch sử tìm kiếm"
            });
        }
    },

    // Get user's search history
    getUserSearchHistory: async (req, res) => {
        try {
            const userId = req.params.userId;
            const history = await modelSearchHistory.find({ userId })
                .sort({ createdAt: -1 })
                .limit(10);

            res.json({
                status: 200,
                message: "Lấy lịch sử tìm kiếm thành công",
                data: history
            });
        } catch (error) {
            console.error("Error getting search history:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi lấy lịch sử tìm kiếm"
            });
        }
    },

    // Delete search history
    deleteSearchHistory: async (req, res) => {
        try {
            const { userId, keyword } = req.body;
            await modelSearchHistory.deleteOne({ userId, keyword });

            res.json({
                status: 200,
                message: "Xóa lịch sử tìm kiếm thành công"
            });
        } catch (error) {
            console.error("Error deleting search history:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi xóa lịch sử tìm kiếm"
            });
        }
    }
};