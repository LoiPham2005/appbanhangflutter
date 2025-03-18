// Thêm import jwt ở đầu file
const jwt = require('jsonwebtoken');
const md = require('../models/model_user');
const bcrypt = require('bcrypt');
const User = require('../models/model_user');

// tạo toekn mới
const generateAuthToken = (userId) => {
    // return jwt.sign(
    //     { id: userId },
    //     process.env.JWT_SECRET || 'default_secret_key',
    //     { expiresIn: '1h' }
    // );
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key',
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await md.find({});
            if (users) {
                res.json(users); // Return array directly instead of wrapping
            } else {
                res.status(404).json([]);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Server Error',
                error: error.message
            });
        }
    },

    register: async (req, res) => {
        try {
            ///Tạo salt ngẫu nhiên để mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);

            // Tạo user mới
            const user = new md({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });

            //Mã hóa mật khẩu với salt
            user.password = await bcrypt.hash(user.password, salt);

            // Tạo token xác thực cho user mới bằng hàm generateAuthToken
            // user.accessToken = generateAuthToken(user._id);

            const { accessToken, refreshToken } = generateAuthToken(user._id);
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;

            // Lưu user vào database      
            const newUser = await user.save();
            // res.status(200).json({ newUser });
            res.status(200).json({
                user: newUser,
                accessToken,
                refreshToken
            });

        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Registration failed' });
        }
    },

    // đăng nhập
    login: async (req, res) => {
        try {
            // Thêm platform vào request body để phân biệt nguồn đăng nhập
            const { email, password, platform } = req.body;
            
            const user = await md.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    status: 400,
                    message: 'Email không tồn tại'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    status: 400,  
                    message: 'Mật khẩu không đúng'
                });
            }

            // Kiểm tra role theo platform
            if (platform === 'web' && user.role !== 'admin') {
                return res.status(403).json({
                    status: 403,
                    message: 'Chỉ tài khoản Admin mới có thể đăng nhập vào trang quản trị'
                });
            }

            if (platform === 'mobile' && user.role !== 'user') {
                return res.status(403).json({
                    status: 403,
                    message: 'Chỉ tài khoản User mới có thể đăng nhập vào ứng dụng'
                });
            }

            const { accessToken, refreshToken } = generateAuthToken(user._id);
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;

            await user.save();

            res.json({
                status: 200,
                message: 'Đăng nhập thành công',
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    sex: user.sex,
                    phone: user.phone,
                    birth_date: user.birth_date
                },
                accessToken,
                refreshToken
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                status: 500,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // New refresh token endpoint
    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh Token Required' });
            }

            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await md.findById(decoded.id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ message: 'Invalid Refresh Token' });
            }

            // Generate new tokens
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateAuthToken(user._id);

            user.accessToken = newAccessToken;
            user.refreshToken = newRefreshToken;
            await user.save();

            res.json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });

        } catch (error) {
            console.error(error);
            res.status(403).json({ message: 'Invalid Refresh Token' });
        }
    },

    // đăng xuất
    logout: async (req, res) => {
        try {
            const user = req.user;
            user.accessToken = null;
            user.refreshToken = null;
            await user.save();
            res.json({ message: 'User logged out successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    // sửa thông tin cá nhân
    editUser: async (req, res) => {
        try {
            const result = await md.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (result) {
                res.json({
                    "status": 200,
                    "message": "Cập nhật thành công",
                    "data": result
                });
            } else {
                res.json({
                    "status": 400,
                    "message": "Cập nhật thất bại",
                    "data": []
                });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({
                "status": 500,
                "message": "Lỗi server",
                "error": error.message
            });
        }
    },

    // Get admin user
    getAdmin: async (req, res) => {
        try {
            const admin = await md.findOne({ role: 'admin' });
            if (!admin) {
                return res.status(404).json({
                    status: 404,
                    message: "Admin user not found"
                });
            }

            res.json({
                status: 200,
                message: "Admin user found",
                data: admin
            });
        } catch (error) {
            console.error("Error getting admin:", error);
            res.status(500).json({
                status: 500,
                message: "Error getting admin user",
                error: error.message
            });
        }
    },

    // Add this to the module.exports object
    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.params.id;

            // Find user
            const user = await md.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy người dùng"
                });
            }

            // Verify old password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    status: 400,
                    message: "Mật khẩu cũ không đúng"
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            user.password = hashedPassword;
            await user.save();

            res.json({
                status: 200,
                message: "Đổi mật khẩu thành công"
            });

        } catch (error) {
            console.error("Error changing password:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi server",
                error: error.message
            });
        }
    }
}