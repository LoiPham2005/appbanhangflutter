var express = require('express');
var router = express.Router();
const modelVoucher = require('../models/model_voucher');

module.exports = {
    // Add voucher
    add: async (req, res) => {
        try {
            const model = new modelVoucher(req.body);
            const result = await model.save();
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Thêm voucher thành công",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Thêm voucher thất bại",
                    "data": []
                });
            }
        } catch (err) {
            console.error("Error while saving voucher:", err);
            res.status(500).send({ error: 'An error occurred while saving data' });
        }
    },

    // Get all vouchers
    list: async (req, res) => {
        try {
            const result = await modelVoucher.find();
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Danh sách voucher",
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
            console.error("Error fetching vouchers:", err);
            res.status(500).send({ error: 'An error occurred while fetching data' });
        }
    },

    // Get voucher by ID
    getbyid: async (req, res) => {
        try {
            const result = await modelVoucher.findById(req.params.id);
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Tìm thấy voucher",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Không tìm thấy voucher",
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

    // Update voucher
    edit: async (req, res) => {
        try {
            const result = await modelVoucher.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Cập nhật voucher thành công",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Cập nhật voucher thất bại",
                    "data": []
                });
            }
        } catch (error) {
            console.error("Error updating voucher:", error);
            res.status(500).send({ error: 'An error occurred while updating' });
        }
    },

    // Delete voucher
    delete: async (req, res) => {
        try {
            const result = await modelVoucher.findByIdAndDelete(req.params.id);
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Xóa voucher thành công",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Xóa voucher thất bại",
                    "data": []
                });
            }
        } catch (error) {
            console.error("Error deleting voucher:", error);
            res.status(500).send({ error: 'An error occurred while deleting' });
        }
    },

    // Search vouchers
    search: async (req, res) => {
        try {
            const key = req.query.key;
            const result = await modelVoucher.find({
                $or: [
                    { name: { $regex: key, $options: 'i' } },
                    { code: { $regex: key, $options: 'i' } }
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
            console.error("Error searching vouchers:", err);
            res.status(500).send({ error: 'An error occurred while searching' });
        }
    }
};