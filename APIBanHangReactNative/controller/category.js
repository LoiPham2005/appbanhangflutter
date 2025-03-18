var express = require('express');
var router = express.Router();
const modelCategory = require('../models/model_category');

module.exports = {
    // add data
    add: async (req, res) => {
        try {
            const { name } = req.body; // Assuming 'name' is the unique field
            const existingCategory = await modelCategory.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({
                    "status": 400,
                    "message": "Tên danh mục đã tồn tại",
                    "data": []
                });
            }
            
            const model = new modelCategory(req.body);
            console.log("Data to be saved:", model);
            const result = await model.save();
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Thêm thành công",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Thêm thất bại",
                    "data": []
                });
            }
            // res.send(result);
        } catch (err) {
            console.error("Error while saving user:", err);
            res.status(500).send({ error: 'An error occurred while saving data' });
        }
    },

    // lấy toàn bộ dữ liệu ra
    list: async (req, res) => {
        try {
            const result = await modelCategory.find();
            // res.send(result);

            if (result) {
                res.json({
                    "status": 200,
                    "message": "List",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Lỗi",
                    "data": []
                });
            }
        } catch (err) {
            console.error("Error while fetching users:", err); // In l��i chi tiết ra console
            res.status(500).send({ error: 'An error occurred while fetching data' }); // Trả về l��i cho client
        }
    },

    // lấy dữ liệu theo ID
    getbyid: async (req, res) => {
        try {
            const result = await modelCategory.findById(req.params.id);
            if (result) {
                // res.send(result);  
                res.json({
                    "status": 200,
                    "message": "Đã tìm thấy ID",
                    "data": result
                })
            } else {
                res.json({
                    "status": 400,
                    "message": "Không tìm thấy ID",
                    "data": []
                })
            }
        } catch (error) {
            if (error.name === 'CastError') {
                res.status(404).send('Invalid ID format');
            } else {
                console.log(error);
                res.status(500).send('Invalid Server format');
            }
        }
    },

    // sử thông tin
    edit: async (req, res) => {
        try {
            const result = await modelCategory.findByIdAndUpdate(req.params.id, req.body);
            if (result) {
                const rs = await result.save();
                // res.send(rs);
                res.json({
                    "status": 200,
                    "message": "Cập nhật thàng công",
                    "data": rs
                })
            } else {
                res.json({
                    "status": 400,
                    "message": "Cập nhật thất bại",
                    "data": []
                })
            }
        } catch (error) {
            if (error.name === 'CastError') {
                res.status(404).send('Invalid ID format');
            } else {
                console.log(error);
                res.status(500).send('Invalid Server format');
            }
        }
    },

    // Xóa dữ liệu theo ID
    delete: async (req, res) => {
        try {
            const result = await modelCategory.findByIdAndDelete(req.params.id);
            if (result) {
                res.json({
                    "status": 200,
                    "message": "Xóa thành công",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Xóa thất bại",
                    "data": []
                });
            }
        } catch (error) {
            console.log(error);
        }
    },

    // search tìm kiếm
    search: async (req, res) => {
        try {
            const key = req.query.key;
            const result = await modelCategory.find({ name: { "$regex": key, "$options": 'i' } })
                .sort({ createdAt: -1 })
            if (result) {
                res.json({
                    "status": 200,
                    "message": "List",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Lỗi",
                    "data": []
                });
            }
        } catch (err) {
            console.error("Error while fetching users:", err); // In l��i chi tiết ra console
            res.status(500).send({ error: 'An error occurred while fetching data' }); // Trả về l��i cho client
        }
    }
}

