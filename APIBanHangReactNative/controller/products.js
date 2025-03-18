var express = require('express');
var router = express.Router();
const modelProducts = require('../models/model_products');
const Category = require('../models/model_category'); // Thêm dòng này
const fs = require('fs');
const path = require('path');

// Thêm hàm helper để xóa file
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
        reject(err);
      } else {
        console.log(`Successfully deleted file ${filePath}`);
        resolve();
      }
    });
  });
};

module.exports = {
    // add data chỉ mỗi ảnh
    // add: async (req, res) => {
    //     try {
    //         console.log("Request Body:", req.body);
    //         const id_category = req.body.id_category;
    //         if (!id_category) {
    //             return res.status(400).json({ error: 'id_category is required' });
    //         }

    //         // Ensure images array exists
    //         if (!req.body.images || !Array.isArray(req.body.images)) {
    //             return res.status(400).json({ error: 'images array is required' });
    //         }

    //         const model = new modelProducts({
    //             ...req.body,
    //             id_category: id_category,
    //             images: req.body.images // Array of image URLs
    //         });

    //         console.log("Data to be saved:", model);
    //         const result = await model.save();

    //         if (result) {
    //             res.json({
    //                 "status": 200,
    //                 "message": "Thêm thành công",
    //                 "data": result
    //             });
    //         } else {
    //             res.json({
    //                 "status": 400,
    //                 "message": "Thêm thất bại",
    //                 "data": []
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Error while saving product:", err);
    //         res.status(500).send({ error: 'An error occurred while saving data' });
    //     }
    // },

    // add data ảnh và video
    add: async (req, res) => {
        try {
            console.log("Request Body:", req.body);
            const id_category = req.body.id_category;
            if (!id_category) {
                return res.status(400).json({ error: 'id_category is required' });
            }

            // Kiểm tra media array
            if (!req.body.media || !Array.isArray(req.body.media)) {
                return res.status(400).json({ error: 'media array is required' });
            }

            // Validate media array
            const validMediaTypes = ['image', 'video'];
            const isValidMedia = req.body.media.every(item => 
                item.type && 
                item.url && 
                validMediaTypes.includes(item.type)
            );

            if (!isValidMedia) {
                return res.status(400).json({ 
                    error: 'Invalid media format. Each media item must have type (image/video) and url' 
                });
            }

            const model = new modelProducts({
                ...req.body,
                id_category: id_category,
                media: req.body.media
            });

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
        } catch (err) {
            console.error("Error while saving product:", err);
            res.status(500).send({ error: 'An error occurred while saving data' });
        }
    },

  // lấy toàn bộ dữ liệu ra
  list: async (req, res) => {
        try {
            const result = await modelProducts.find();
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
            console.error("Error while fetching users:", err);
            res.status(500).send({ error: 'An error occurred while fetching data' });
        }
    },

    // lấy dữ liệu theo ID
    getbyid: async (req, res) => {
        try {
            const result = await modelProducts.findById(req.params.id);
            if (result) {
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
            const result = await modelProducts.findByIdAndUpdate(req.params.id, req.body);
            if (result) {
                const rs = await result.save();
                res.json({
                    "status": 200,
                    "message": "Cập nhật thành công",
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

    // Sửa lại hàm delete
    delete: async (req, res) => {
        try {
            // Tìm sản phẩm trước khi xóa để lấy thông tin media
            const product = await modelProducts.findById(req.params.id);
            if (!product) {
                return res.json({
                    status: 400,
                    message: "Không tìm thấy sản phẩm",
                    data: []
                });
            }

            // Xóa các file media từ thư mục uploads
            if (product.media && product.media.length > 0) {
                const deletePromises = product.media.map(media => {
                    const filename = media.url.split('/').pop();
                    const filePath = path.join('public', 'uploads', filename);
                    return deleteFile(filePath);
                });

                await Promise.all(deletePromises);
            }

            // Xóa sản phẩm từ database
            const result = await modelProducts.findByIdAndDelete(req.params.id);
            
            res.json({
                status: 200,
                message: "Xóa thành công",
                data: result
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi xóa sản phẩm",
                error: error.message
            });
        }
    },

    search: async (req, res) => {
        try {
            const key = req.query.key;
            const title = req.query.title;
            const category = req.query.category;
            const publishing_house = req.query.publishing_house;

            const query = {};
            if (key) query.$or = [{ name: { "$regex": key, "$options": 'i' } }, { title: { "$regex": key, "$options": 'i' } }, { publishing_house: { "$regex": key, "$options": 'i' } }];
            if (title) query.title = { "$regex": title, "$options": 'i' };
            if (category) query.id_category = category; // Assuming category is sent as ObjectId
            if (publishing_house) query.publishing_house = { "$regex": publishing_house, "$options": 'i' };

            const result = await modelProducts.find(query)
                .sort({ createdAt: -1 });
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
            console.error("Error while fetching users:", err);
            res.status(500).send({ error: 'An error occurred while fetching data' });
        }
    }
}
