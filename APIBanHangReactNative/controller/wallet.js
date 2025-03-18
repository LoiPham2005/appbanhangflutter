const express = require('express');
const router = express.Router();
const modelWallet = require('../models/model_e-wallet');

module.exports = {
    // Add new wallet
    add: async (req, res) => {
        try {
            const model = new modelWallet(req.body);
            const result = await model.save();
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Thêm ví thành công",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Thêm ví thất bại",
                    "data": []
                });
            }
        } catch (err) {
            console.error("Error while saving wallet:", err);
            res.status(500).send({ error: 'An error occurred while saving data' });
        }
    },

    // Get all wallets
    list: async (req, res) => {
        try {
            const result = await modelWallet.find();
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Danh sách ví",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Lỗi lấy danh sách",
                    "data": []
                });
            }
        } catch (err) {
            console.error("Error while fetching wallets:", err);
            res.status(500).send({ error: 'An error occurred while fetching data' });
        }
    },

    // Get wallet by ID
    getbyid: async (req, res) => {
        try {
            const result = await modelWallet.findById(req.params.id);
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Tìm thấy ví",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Không tìm thấy ví",
                    "data": []
                });
            }
        } catch (error) {
            if (error.name === 'CastError') {
                res.status(404).send('Invalid ID format');
            } else {
                res.status(500).send('Server error');
            }
        }
    },

    // Update wallet
    edit: async (req, res) => {
        try {
            const { transaction } = req.body;

            const wallet = await modelWallet.findById(req.params.id);
            if (!wallet) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy ví"
                });
            }

            // Add new transaction with timestamp
            const newTransaction = {
                ...transaction,
                timestamp: new Date(),
                status: 'completed'
            };

            wallet.transactions.push(newTransaction);

            // Update balance
            if (transaction.type === 'credit') {
                wallet.balance += transaction.amount;
            } else {
                wallet.balance -= transaction.amount;
            }

            const result = await wallet.save();

            res.json({
                status: 200,
                message: "Cập nhật ví thành công",
                data: result
            });
        } catch (error) {
            console.error("Error updating wallet:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi cập nhật ví",
                error: error.message
            });
        }
    },

    // Delete wallet
    delete: async (req, res) => {
        try {
            const result = await modelWallet.findByIdAndDelete(req.params.id);
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Xóa ví thành công",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Xóa ví thất bại",
                    "data": []
                });
            }
        } catch (error) {
            console.error("Error deleting wallet:", error);
            res.status(500).send({ error: 'An error occurred while deleting' });
        }
    },

    // Search wallets
    search: async (req, res) => {
        try {
            const key = req.query.key;
            const result = await modelWallet.find({
                $or: [
                    { 'userId': { $regex: key, $options: 'i' } },
                    { 'transactions.description': { $regex: key, $options: 'i' } }
                ]
            });
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Kết quả tìm kiếm",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Không tìm thấy kết quả",
                    "data": []
                });
            }
        } catch (err) {
            console.error("Error searching wallets:", err);
            res.status(500).send({ error: 'An error occurred while searching' });
        }
    }
};