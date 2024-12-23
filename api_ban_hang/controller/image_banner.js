var express = require('express');
var router = express.Router();
const modelImages = require('../models/model_image_banner');

module.exports = {
  // add data
  add: async (req, res) => {
      try {
          const model = new modelImages(req.body);
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
      } catch (err) {
          console.error("Error while saving user:", err);
          res.status(500).send({ error: 'An error occurred while saving data' });
      }
  },

  // lấy toàn bộ dữ liệu ra
  list: async (req, res) => {
      try {
          const result = await modelImages.find();
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
          const result = await modelImages.findById(req.params.id);
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
          const result = await modelImages.findByIdAndUpdate(req.params.id, req.body);
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

  // Xóa dữ liệu theo ID
  delete: async (req, res) => {
      try {
          const result = await modelImages.findByIdAndDelete(req.params.id);
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
          const result = await modelImages.find({ name: { "$regex": key, "$options": 'i' } })
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
          console.error("Error while fetching users:", err); 
          res.status(500).send({ error: 'An error occurred while fetching data' }); 
      }
  }
}
