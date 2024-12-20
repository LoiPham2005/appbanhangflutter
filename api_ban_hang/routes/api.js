var express = require('express');
var router = express.Router();

var mdw = require('../middleware/middleware')
var future_user = require('../controller/future_user');
var forgotPassword = require('../controller/forgot_password');
var category = require('../controller/category')
var products = require('../controller/products')

// router.get('/users',mdw.api_auth, api_u.); // link ds:  http://localhost:3000/api/users
// đăng kí , đăng nhập
router.post('/users/login', future_user.login); // đăng nhập
router.post('/users/reg', future_user.register); // đăng ký
router.get('/users/list',mdw.api_auth , future_user.getAllUsers); // lấy thông tin user
router.post('/users/logout', mdw.api_auth, future_user.logout); // đăng xuất

// quên mật khẩu
router.post('/check/sendOtp', forgotPassword.sendOtp);
router.post('/check/checkOTP', forgotPassword.checkOtpValidity);
router.put('/check/reset-password/:email', forgotPassword.resetPassword);
router.delete('/check/deleteOTP/:email', forgotPassword.deleteOTP);

// thêm sửa xoá hiển thị category
router.post('/category/add', category.add);
router.get('/category/list', category.list);
router.put('/category/edit/:id', category.edit);
router.delete('/category/delete/:id', category.delete);
router.get('/category/search', category.search);

// thêm sửa xoá hiển thị products
router.post('/products/add', products.add);
router.get('/products/list', products.list);
router.put('/products/edit/:id', products.edit);
router.delete('/products/delete/:id', products.delete);
router.get('/products/search', products.search);



module.exports = router;