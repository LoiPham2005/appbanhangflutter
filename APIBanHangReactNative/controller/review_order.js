const express = require('express');
const router = express.Router();
const modelReview = require('../models/model_review_order');

module.exports = {
    // Add review
    addReview: async (req, res) => {
        try {
            const { id_user, id_order, id_product, rating, comment, images } = req.body;

            // Log để debug
            console.log('Received review data:', req.body);

            // Validate required fields
            if (!id_user || !id_order || !id_product || !rating || !comment) {
                console.log('Missing fields:', { id_user, id_order, id_product, rating, comment });
                return res.status(400).json({
                    status: 400,
                    message: "Missing required fields",
                    details: {
                        id_user: !id_user,
                        id_order: !id_order,
                        id_product: !id_product,
                        rating: !rating,
                        comment: !comment
                    }
                });
            }

            // Kiểm tra đánh giá đã tồn tại
            const existingReview = await modelReview.findOne({
                id_user,
                id_order,
                id_product
            });

            if (existingReview) {
                return res.status(400).json({
                    status: 400,
                    message: "Bạn đã đánh giá sản phẩm này"
                });
            }

            const review = new modelReview({
                id_user,
                id_order,
                id_product,
                rating,
                comment,
                images: images || [],
                status: 'approved' // Tự động approve review
            });

            const result = await review.save();

            res.json({
                status: 200,
                message: "Đánh giá thành công",
                data: result
            });
        } catch (error) {
            console.error("Error adding review:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi thêm đánh giá",
                error: error.message
            });
        }
    },

    // Get reviews by product ID
    getProductReviews: async (req, res) => {
        try {
            const reviews = await modelReview.find({
                id_product: req.params.productId,
                status: 'approved'
            })
                .populate('id_user', 'username avatar')
                .sort({ createdAt: -1 });

            res.json({
                status: 200,
                message: "Reviews retrieved successfully",
                data: reviews
            });
        } catch (error) {
            console.error("Error fetching reviews:", error);
            res.status(500).json({
                status: 500,
                message: "Error fetching reviews",
                error: error.message
            });
        }
    },

    // Get reviews by user ID
    getUserReviews: async (req, res) => {
        try {
            const reviews = await modelReview.find({ id_user: req.params.userId })
                .populate('id_product', 'title media')
                .sort({ createdAt: -1 });

            res.json({
                status: 200,
                message: "User reviews retrieved successfully",
                data: reviews
            });
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            res.status(500).json({
                status: 500,
                message: "Error fetching user reviews",
                error: error.message
            });
        }
    },

    // Update review status (for admin)
    updateReviewStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const review = await modelReview.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: "Review not found"
                });
            }

            res.json({
                status: 200,
                message: "Review status updated successfully",
                data: review
            });
        } catch (error) {
            console.error("Error updating review status:", error);
            res.status(500).json({
                status: 500,
                message: "Error updating review status",
                error: error.message
            });
        }
    },

    // Delete review
    deleteReview: async (req, res) => {
        try {
            const review = await modelReview.findByIdAndDelete(req.params.id);

            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: "Review not found"
                });
            }

            res.json({
                status: 200,
                message: "Review deleted successfully",
                data: review
            });
        } catch (error) {
            console.error("Error deleting review:", error);
            res.status(500).json({
                status: 500,
                message: "Error deleting review",
                error: error.message
            });
        }
    }
};