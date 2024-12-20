var express = require('express');
var router = express.Router();
const modelBanner = require('../models/model_banner');
const upload = require('../config/upload');
// phần thêm vào
const bcrypt = require('bcrypt');
require('dotenv').config();

/* GET users listing. */
router.get('/test', function (req, res, next) {
  res.send('respond with a resource user test');
});

// Register User (lab4)
router.post('/add', upload.single('avatar'), async (req, res) => {
  try {
    const {file} = req; // Lấy tệp từ yêu cầu
     // Kiểm tra nếu không có file

     const { username, password, email, name, age } = req.body; // Kiểm tra các trường

     // Log các giá trị để kiểm tra
     console.log("Received file:", file);
     console.log("Received body:", req.body);
 
     // Kiểm tra nếu không có file hoặc thiếu các trường dữ liệu
     if (!file) {
       return res.status(400).json({ error: 'image is required.' });
     }


    const urlImages = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    const model = new modelUser(req.body);
    model.avatar = urlImages; // Thêm avatar vào dữ liệu user
    console.log("Data to be saved:", model); // In ra dữ liệu sẽ được lưu
    const result = await model.save();

    if (result) {
      const mailOption = {
        from: 'phamducloi919@gmail.com',
        to: model.email,
        subject: 'Welcome to Node JS',
        text: 'Chúc mừng bạn đăng kí thành công',
      }
      await Transporter.sendMail(mailOption);
      res.json({
        "status": 200,
        "message": "Thêm thành công",
        "data": result
      })
    }
    // res.send(result);
  } catch (err) {
    console.error("Error while saving user:", err); // In lỗi chi tiết ra console
    res.status(500).send({ error: 'An error occurred while saving data' }); // Trả về lỗi cho client
  }
});

// lấy toàn bộ dữ liệu ra
router.get('/list', async (req, res) => {
  const result = await modelUser.find({});
  try {
    res.send(result);
  } catch (err) {
    console.error("Error while fetching users:", err); // In lỗi chi tiết ra console
    res.status(500).send({ error: 'An error occurred while fetching data' }); // Trả về lỗi cho client
  }
})

// lấy dữ liệu theo ID
router.get('/getbyid/:id', async (req, res) => {
  try {
    const result = await modelUser.findById(req.params.id);
    if (result) {
      res.send(result);
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
})

// sử thông tin
router.patch('/edit/:id', async (req, res) => {
  try {
    const result = await modelUser.findByIdAndUpdate(req.params.id, req.body);
    if (result) {
      const rs = await result.save();
      res.send(rs);
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
})

// Xóa dữ liệu theo ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await modelUser.findByIdAndDelete(req.params.id);
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
});

module.exports = router;
