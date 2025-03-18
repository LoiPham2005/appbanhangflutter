const express = require('express');
const router = express.Router();

var mdw = require('../middleware/middleware')
var future_user = require('../controller/future_user');
var forgotPassword = require('../controller/forgot_password');
var category = require('../controller/category')
var products = require('../controller/products')
var image_banner = require('../controller/image_banner');
var uploads_image = require('../controller/uploads_image');
const upload = require('../config/upload');
var carts = require('../controller/cart');
var address = require('../controller/address');
var voucher = require('../controller/voucher');
var wallet = require('../controller/wallet');
var order = require('../controller/order');
// Xóa dòng này
// var statics = require('../controller/statics');
const notification = require('../controller/notification');
const chat = require('../controller/chat');
const searchHistory = require('../controller/search_history');
const reviewOrder = require('../controller/review_order');
const momo = require('../controller/momo');

// đăng kí , đăng nhập
router.post('/users/login', future_user.login); // đăng nhập
router.post('/users/reg', future_user.register); // đăng ký
router.get('/users/list', future_user.getAllUsers); // lấy thông tin user
router.post('/users/logout', mdw.api_auth, future_user.logout); // đăng xuất
router.post('/refresh-token', future_user.refreshToken); // refresh token
// Thêm route để cập nhật thông tin user
router.patch('/users/edit/:id', future_user.editUser);
router.get('/users/getAdmin', future_user.getAdmin);
// Add this with other user routes
router.put('/users/change-password/:id', future_user.changePassword);

// quên mật khẩu
router.post('/check/sendOtp', forgotPassword.sendOtp);
router.post('/check/checkOTP', forgotPassword.checkOtpValidity);
router.put('/check/reset-password/:email', forgotPassword.resetPassword);
router.delete('/check/deleteOTP/:email', forgotPassword.deleteOtp);

// đẩy ảnh lên server
// router.post('/upload/multiple',upload.array('images', 5), uploads_image.add);

// đẩy ảnh và video lên server
router.post('/upload/media', upload.array('media', 10), uploads_image.add);

// thêm sửa xoá hiển thị banners
router.post('/banners/add', image_banner.add);
router.get('/banners/list', image_banner.list);
router.put('/banners/edit/:id', image_banner.edit);
router.delete('/banners/delete/:id', image_banner.delete);
router.get('/banners/search', image_banner.search);

// thêm sửa xoá hiển thị category
router.post('/category/add', category.add);
router.get('/category/list', category.list);
router.get('/category/getbyid/:id', category.getbyid);
router.put('/category/edit/:id', category.edit);
router.delete('/category/delete/:id', category.delete);
router.get('/category/search', category.search);

// thêm sửa xoá hiển thị products (middleware nên cho ở add, edit, delete)
// router.post('/products/add',mdw.api_auth, products.add);
router.post('/products/add', products.add);
router.get('/products/getbyid/:id', products.getbyid);
router.get('/products/list', products.list);
router.put('/products/edit/:id', products.edit);
router.delete('/products/delete/:id', products.delete);
router.get('/products/search', products.search);

// thêm sửa xoá hiển thị cart
router.post('/carts/add', carts.add);
router.get('/carts/list', carts.list);
router.put('/carts/edit/:id', carts.edit);
router.delete('/carts/delete/:id', carts.delete);
router.get('/carts/search', carts.search);

// thêm sửa xoá hiển thị address
router.post('/address/add', address.add);
router.get('/address/list', address.list);
router.put('/address/edit/:id', address.edit);
router.delete('/address/delete/:id', address.delete);
router.get('/address/search', address.search);

// Voucher routes
router.post('/voucher/add', voucher.add);
router.get('/voucher/list', voucher.list);
router.get('/voucher/getbyid/:id', voucher.getbyid);
router.put('/voucher/edit/:id', voucher.edit);
router.delete('/voucher/delete/:id', voucher.delete);
router.get('/voucher/search', voucher.search);

// Wallet routes
router.post('/wallet/add', wallet.add);
router.get('/wallet/list', wallet.list);
router.get('/wallet/getbyid/:id', wallet.getbyid);
router.put('/wallet/edit/:id', wallet.edit);
router.delete('/wallet/delete/:id', wallet.delete);
router.get('/wallet/search', wallet.search);

// thêm sửa xoá hiển thị order
router.post('/orders/add', order.add);
router.get('/orders/list', order.list);
router.get('/orders/getbyid/:id', order.getbyid);
router.put('/orders/status/:id', order.updateStatus); // Đảm bảo route này tồn tại
router.get('/orders/user/:userId', order.getUserOrders);

// route thống kê
router.get('/statistics/daily', order.generateDashboardStats);
router.get('/statistics/revenue', order.getRevenueByDateRange);
router.get('/statistics/top-products', order.getTopProducts);
router.get('/statistics/top-customers', order.getTopCustomers);

// thông báo
router.post('/notifications/add', notification.add);
router.get('/notifications/list', notification.list); // Thêm route này
router.get('/notifications/user/:userId', notification.getByUserId);
router.put('/notifications/read/:id', notification.markAsRead);
router.delete('/notifications/:id', notification.delete); // Thêm route này

// Chat routes
router.post('/chat/create', chat.createChat);
router.post('/chat/send', chat.sendMessage);
router.get('/chat/:chatId/messages', chat.getMessages);
router.get('/chat/user/:userId', chat.getUserChats);
router.post('/chat/markAsRead', chat.markAsRead);

// Search History routes
router.post('/search-history/add', searchHistory.addSearchHistory);
router.get('/search-history/user/:userId', searchHistory.getUserSearchHistory);
router.delete('/search-history/delete', searchHistory.deleteSearchHistory);

// Review Order routes
router.post('/reviews/add', reviewOrder.addReview);
router.get('/reviews/product/:productId', reviewOrder.getProductReviews);
router.get('/reviews/user/:userId', reviewOrder.getUserReviews);
router.put('/reviews/status/:id', reviewOrder.updateReviewStatus);
router.delete('/reviews/:id', reviewOrder.deleteReview);

// MoMo payment routes
router.post('/momo/create', momo.createPayment);
router.get('/momo/process-payment', momo.handleCallback);

module.exports = router;