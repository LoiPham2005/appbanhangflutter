const express = require('express');
const router = express.Router();
const modelOrder = require('../models/model_order');
const modelWallet = require('../models/model_e-wallet');
const modelProduct = require('../models/model_products');
const modelUser = require('../models/model_user'); // Thêm dòng này ở đầu file
const modelNotification = require('../models/model_notification'); // Thêm dòng này

module.exports = {
    // Create new order
    add: async (req, res) => {
        try {
            // Validate payment method and process payment
            if (req.body.paymentMethod === 'wallet') {
                const wallet = await modelWallet.findOne({ userId: req.body.id_user });
                if (!wallet || wallet.balance < req.body.finalTotal) {
                    return res.status(400).json({
                        status: 400,
                        message: "Insufficient wallet balance"
                    });
                }

                // Process wallet payment
                wallet.balance -= req.body.finalTotal;
                wallet.transactions.push({
                    transactionId: new Date().getTime().toString(), // Thêm transactionId
                    type: 'debit',
                    amount: req.body.finalTotal,
                    description: 'Order payment'
                });
                await wallet.save();
            }

            // Validate order data
            if (!req.body.items || !Array.isArray(req.body.items)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid items data"
                });
            }

            // Create order
            const order = new modelOrder(req.body);
            const result = await order.save();

            // Update product quantities
            for (const item of req.body.items) {
                await modelProduct.findByIdAndUpdate(
                    item.id_product,
                    { $inc: { stock_quantity: -item.purchaseQuantity } }
                );
            }

            res.json({
                status: 200,
                message: "Order created successfully",
                data: result
            });
        } catch (err) {
            console.error("Error creating order:", err);
            res.status(500).json({
                status: 500,
                message: "Error creating order",
                error: err.message
            });
        }
    },

    // Get all orders
    list: async (req, res) => {
        try {
            const result = await modelOrder.find()
                .populate('id_user', 'username email')
                .populate({
                    path: 'items.id_product',
                    select: 'title media price publishing_house _id',
                    model: 'products'
                });

            // Debug log
            console.log('Orders after populate:', JSON.stringify(result, null, 2));

            result.forEach(order => {
                order.items.forEach((item, index) => {
                    if (!item.id_product) {
                        console.log(`Order ${order._id} - Item ${index} has null product`);
                    }
                });
            });

            if (!result) {
                return res.status(404).json({
                    status: 404,
                    message: "No orders found"
                });
            }

            // Xử lý dữ liệu trước khi trả về
            const processedOrders = result.map(order => {
                const items = order.items.map(item => {
                    if (!item.id_product) {
                        console.log(`Missing product for item in order ${order._id}`);
                    }
                    return {
                        ...item.toObject(),
                        id_product: item.id_product || null
                    };
                });

                return {
                    ...order.toObject(),
                    items
                };
            });

            res.json({
                status: 200,
                message: "Orders retrieved successfully",
                data: processedOrders
            });
        } catch (err) {
            console.error("Error fetching orders:", err);
            res.status(500).json({
                status: 500,
                message: "Error fetching orders",
                error: err.message
            });
        }
    },

    // Get order by ID
    getbyid: async (req, res) => {
        try {
            const result = await modelOrder.findById(req.params.id)
                .populate('id_user', 'username email')
                .populate({
                    path: 'items.id_product',
                    select: 'title media price publishing_house _id',
                    model: 'products'
                })
                .lean();

            // Log để debug
            console.log('Order items after populate:', JSON.stringify(result.items, null, 2));

            if (!result) {
                return res.status(404).json({
                    status: 404,
                    message: "Order not found"
                });
            }

            res.json({
                status: 200,
                message: "Order found",
                data: result
            });
        } catch (err) {
            console.error("Error fetching order:", err);
            res.status(500).json({
                status: 500,
                message: "Error fetching order",
                error: err.message
            });
        }
    },

    // Update order status with return request
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            console.log('Updating order:', id, 'to status:', status); // Debug log

            const order = await modelOrder.findById(id)
                .populate('id_user', 'username');

            if (!order) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy đơn hàng"
                });
            }

            // Cập nhật trạng thái
            order.status = status;
            await order.save();

            try {
                // Tạo notification data
                const notificationData = {
                    userId: order.id_user._id,
                    title: 'Cập nhật đơn hàng',
                    message: `Đơn hàng #${order._id.toString().slice(-6)} đã được cập nhật sang trạng thái: ${status}`,
                    type: 'order',
                    data: {
                        orderId: order._id,
                        status: status,
                        updatedAt: new Date().toISOString()
                    }
                };

                // Tạo notification trong database
                const notification = new modelNotification(notificationData);
                await notification.save();

                // Emit socket event đến user
                const io = req.app.get('io');
                io.to(`user_${order.id_user._id}`).emit('new_notification', {
                    notification: notificationData,
                    type: 'order_status'
                });

            } catch (notificationError) {
                console.error("Error sending notification:", notificationError);
                // Tiếp tục xử lý ngay cả khi gửi thông báo thất bại
            }

            res.json({
                status: 200,
                message: "Cập nhật trạng thái thành công",
                data: order
            });

        } catch (error) {
            console.error("Error updating order status:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi khi cập nhật trạng thái đơn hàng",
                error: error.message
            });
        }
    },

    // Get user's orders
    getUserOrders: async (req, res) => {
        try {
            const result = await modelOrder.find({ id_user: req.params.userId })
                .populate('id_user', 'username email') // Populate user info
                .populate({
                    path: 'items.id_product',
                    select: 'title media price publishing_house _id', // Select needed fields
                    model: 'products'
                })
                .sort({ createdAt: -1 });

            res.json({
                status: 200,
                message: "User orders retrieved successfully",
                data: result
            });
        } catch (err) {
            console.error("Error fetching user orders:", err);
            res.status(500).json({
                status: 500,
                message: "Error fetching user orders",
                error: err.message
            });
        }
    },

    // Thêm hàm mới để thống kê dashboard
    generateDashboardStats: async (req, res) => {
        try {
            // Lấy tổng số người dùng
            const totalUsers = await modelUser.countDocuments();

            // Lấy tất cả đơn hàng và lọc theo trạng thái
            const orders = await modelOrder.find().lean();
            const totalOrders = orders.length;

            // Đếm số đơn hàng đang chờ xử lý (chỉ đơn pending)
            const pendingOrders = orders.filter(order => order.status === 'pending').length;

            // Tính tổng doanh thu từ các đơn hàng đã hoàn thành
            const completedOrders = orders.filter(order =>
                ['delivered', 'reviewed'].includes(order.status)
            );
            const totalRevenue = completedOrders.reduce((sum, order) =>
                sum + (order.finalTotal || 0), 0
            );

            // Tính doanh thu hôm nay và hôm qua
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todayOrders = completedOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= today && orderDate < tomorrow;
            });

            const yesterdayOrders = completedOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= yesterday && orderDate < today;
            });

            const todayRevenue = todayOrders.reduce((sum, order) =>
                sum + (order.finalTotal || 0), 0
            );
            const yesterdayRevenue = yesterdayOrders.reduce((sum, order) =>
                sum + (order.finalTotal || 0), 0
            );

            // Tính % thay đổi doanh thu
            const revenueChange = yesterdayRevenue !== 0
                ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)
                : todayRevenue > 0 ? 100 : 0;

            // Tính % thay đổi đơn hàng
            const ordersChange = yesterdayOrders.length !== 0
                ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length * 100).toFixed(1)
                : todayOrders.length > 0 ? 100 : 0;

            res.json({
                status: 200,
                message: "Statistics generated successfully",
                data: {
                    totalUsers,
                    totalOrders,
                    totalRevenue,
                    pendingOrders,
                    revenueChange: parseFloat(revenueChange),
                    ordersChange: parseFloat(ordersChange)
                }
            });

        } catch (error) {
            console.error("Error generating statistics:", error);
            res.status(500).json({
                status: 500,
                message: "Error generating statistics",
                error: error.message
            });
        }
    },

    // Thêm hàm mới để lấy doanh thu theo khoảng thời gian
    getRevenueByDateRange: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            // Validate dates
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            // Lấy các đơn hàng trong khoảng thời gian
            const orders = await modelOrder.find({
                createdAt: {
                    $gte: start,
                    $lte: end
                },
                status: { $in: ['delivered', 'reviewed'] }
            }).sort({ createdAt: 1 });

            // Tạo map để gom doanh thu theo ngày
            const revenueByDate = new Map();

            orders.forEach(order => {
                const date = order.createdAt.toISOString().split('T')[0];
                if (!revenueByDate.has(date)) {
                    revenueByDate.set(date, {
                        amount: 0,
                        orderCount: 0
                    });
                }
                const dateData = revenueByDate.get(date);
                dateData.amount += order.finalTotal || 0;
                dateData.orderCount += 1;
            });

            const chartData = Array.from(revenueByDate, ([date, data]) => ({
                date,
                amount: data.amount,
                orderCount: data.orderCount
            }));

            res.json({
                status: 200,
                message: "Data retrieved successfully",
                data: chartData
            });

        } catch (error) {
            console.error("Error getting data:", error);
            res.status(500).json({
                status: 500,
                message: "Error getting data",
                error: error.message
            });
        }
    },

    // Thêm hàm mới để lấy top sản phẩm bán chạy
    getTopProducts: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            const orders = await modelOrder.find({
                createdAt: {
                    $gte: start,
                    $lte: end
                },
                status: { $in: ['delivered', 'reviewed'] }
            }).populate({
                path: 'items.id_product',
                populate: {
                    path: 'id_category'
                }
            });

            const productStats = new Map();

            orders.forEach(order => {
                order.items.forEach(item => {
                    if (!item.id_product) return;

                    const productId = item.id_product._id.toString();
                    const currentStats = productStats.get(productId) || {
                        product: item.id_product,
                        totalQuantity: 0,
                        totalRevenue: 0
                    };

                    currentStats.totalQuantity += item.purchaseQuantity;
                    currentStats.totalRevenue += item.price * item.purchaseQuantity;
                    productStats.set(productId, currentStats);
                });
            });

            const topProducts = Array.from(productStats.values())
                .sort((a, b) => b.totalQuantity - a.totalQuantity)
                .slice(0, 10)
                .map(stats => ({
                    id: stats.product._id,
                    title: stats.product.title,
                    publishing_house: stats.product.publishing_house,
                    price: stats.product.price,
                    id_category: stats.product.id_category,
                    image: stats.product.media?.[0]?.url || null,
                    quantity: stats.totalQuantity,
                    revenue: stats.totalRevenue
                }));

            res.json({
                status: 200,
                message: "Top products retrieved successfully",
                data: topProducts
            });

        } catch (error) {
            console.error("Error getting top products:", error);
            res.status(500).json({
                status: 500,
                message: "Error getting top products",
                error: error.message
            });
        }
    },

    getTopCustomers: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            const orders = await modelOrder.find({
                createdAt: {
                    $gte: start,
                    $lte: end
                },
                status: { $in: ['delivered', 'reviewed'] }
            }).populate('id_user', 'username email avatar phone birth_date');

            const customerStats = new Map();

            orders.forEach(order => {
                if (!order.id_user) return;

                const userId = order.id_user._id.toString();
                const currentStats = customerStats.get(userId) || {
                    user: order.id_user,
                    totalOrders: 0,
                    totalSpent: 0,
                    lastPurchase: null
                };

                currentStats.totalOrders += 1;
                currentStats.totalSpent += order.finalTotal;
                currentStats.lastPurchase = order.createdAt;

                customerStats.set(userId, currentStats);
            });

            const topCustomers = Array.from(customerStats.values())
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 10)
                .map(stats => ({
                    id: stats.user._id,
                    username: stats.user.username,
                    email: stats.user.email,
                    avatar: stats.user.avatar,
                    phone: stats.user.phone || 'Chưa cập nhật',
                    birth_date: stats.user.birth_date ? new Date(stats.user.birth_date).toLocaleDateString('vi-VN') : 'Chưa cập nhật',
                    totalOrders: stats.totalOrders,
                    totalSpent: stats.totalSpent,
                    lastPurchase: new Date(stats.lastPurchase).toLocaleDateString('vi-VN')
                }));

            res.json({
                status: 200,
                message: "Top customers retrieved successfully",
                data: topCustomers
            });

        } catch (error) {
            console.error("Error getting top customers:", error);
            res.status(500).json({
                status: 500,
                message: "Error getting top customers",
                error: error.message
            });
        }
    }
};