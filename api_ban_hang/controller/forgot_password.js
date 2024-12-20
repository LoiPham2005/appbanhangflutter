require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Tạo mã OTP
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const modelOTP = require('../models/model_otp'); // Ensure this is the only import for User
const UserModel = require('../models/model_user'); // Import model User

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc dịch vụ email khác
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn (được lấy từ biến môi trường)
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng Gmail
  },
});

// Hàm thay đổi mật khẩu
const changePassword = async (email, newPassword) => {
  try {
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Tìm người dùng theo email
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error('Email không tồn tại');
    }

    // Cập nhật mật khẩu mới và xóa OTP
    user.password = hashedPassword;
    user.otp = null; // Xóa OTP
    user.otpExpire = null; // Xóa thời gian hết hạn OTP
    // await user.save();

    // return { message: 'Đặt lại mật khẩu thành công' };
    return await user.save();
  } catch (error) {
    console.error(error);
  }
}

// Hàm kiểm tra mã OTP
const checkOtpValidity = async (email, otp) => {
  try {
    // Tìm người dùng theo email
    const user = await modelOTP.findOne({ email });

    if (!user) {
      throw new Error('Email không tồn tại');
    }

    // Logging giá trị OTP và thời gian hết hạn
    console.log(`Mã OTP nhập vào: ${otp}`);
    console.log(`Mã OTP trong cơ sở dữ liệu: ${user.otp}`);
    console.log(`Thời gian hết hạn: ${user.otpExpire}`);

    // Kiểm tra OTP và thời gian hết hạn
    if (user.otp !== otp || new Date() > user.otpExpire) {
      throw new Error('OTP không hợp lệ hoặc đã hết hạn');
    }
    return true; // OTP hợp lệ
  } catch (error) {
    console.log(error.message); // Trả về lỗi nếu có vấn đề
  }
};



module.exports = {
  // API gửi mã OTP
  sendOtp: async (req, res) => {
    const { email } = req.body;

    try {
      // Kiểm tra email có tồn tại trong cơ sở dữ liệu không
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Email không tồn tại' });
      }

      // Tạo mã OTP
      const otp = crypto.randomInt(100000, 999999).toString(); // Tạo mã 6 chữ số
      const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

      // Cập nhật OTP và thời gian hết hạn vào cơ sở dữ liệu
      user.otp = otp;
      user.otpExpire = otpExpire;
      await user.save();

      // Gửi email chứa mã OTP
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã xác nhận quên mật khẩu',
        text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
      };


      await transporter.sendMail(mailOptions);
      // res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn' });

      const model = new modelOTP({
        email: email,
        otp: otp,
        otpExpire: otpExpire
      })

      const result = await model.save();
      if (result) {
        res.json({
          "status": 200,
          "message": "Mã OTP đã được gửi đến email của bạn",
          "data": result
        });
      } else {
        res.json({
          "status": 400,
          "message": "Lưu thất bại",
          "data": []
        });
      }

    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      res.status(500).json({ message: 'Lỗi khi gửi email' });
    }
  },


  // API xác minh OTP
  checkOtpValidity: async (req, res) => {
    const { email, otp } = req.body; // Lấy email và otp từ body của yêu cầu
    try {
      // Gọi hàm với các tham số đúng
      const isOtpValid = await checkOtpValidity(email, otp); // Gọi hàm độc lập
      if (isOtpValid) {
        res.status(200).json({ message: 'Mã OTP hợp lệ' });
      } else {
        res.status(400).json({ message: 'Mã OTP không hợp lệ' });
      }
    } catch (error) {
      console.error('Lỗi khi xác minh OTP:', error);
      res.status(400).json({ message: error.message });
    }
  },


  // API xác minh OTP và đổi mật khẩu
  resetPassword: async (req, res) => {
    // const { email, otp, newPassword } = req.body;
    const { email, newPassword } = req.body;

    console.log(email);
    console.log(newPassword);

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Thiếu thông tin email, OTP hoặc mật khẩu mới' });
    }

    try {
      // trường hợp kết hợp cả check cả đổi mật khẩu
      // Kiểm tra OTP hợp lệ
      // const isOtpValid = await checkOtpValidity(email, otp);

      // if (isOtpValid) {
      //   // Đổi mật khẩu nếu OTP hợp lệ
      //   const result = await changePassword(email, newPassword);
      //   res.status(200).json(result);
      // }

      // trường hợp check trước đó và giờ chỉ đổi mật khẩu
      const result = await changePassword(email, newPassword);
      if (result) {
        res.status(200).json({
          "status": 200,
          "message": "Đổi mật khẩu thành công",
          "data": result
        });
      } else {
        res.status(400).json({
          "status": 400,
          "message": "Đổi mật khẩu thất bại",
          "data": []
        });
      }
      // res.status(200).json(result);
    } catch (error) {
      console.error('Lỗi khi xác minh OTP hoặc đổi mật khẩu:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Xóa dữ liệu theo email
  deleteOTP:  async (req, res) => {
    try {
      // const result = await modelOTP.findByIdAndDelete(req.params.id);
      const result = await modelOTP.findOneAndDelete({ email: req.params.email });
      if (result) {
        res.json({
          "status": 200,
          "message": "Xóa thành công OTP",
          "data": result
        });
      } else {
        res.json({
          "status": 400,
          "message": "Xóa thất bại OTP",
          "data": []
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
