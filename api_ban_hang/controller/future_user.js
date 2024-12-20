// Thêm import jwt ở đầu file
const jwt = require('jsonwebtoken');
const md = require('../models/model_user');
const bcrypt = require('bcrypt');
const User = require('../models/model_user');

// tạo toekn mới
const generateAuthToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '1h' }
    );
};

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await md.find({});
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
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
             user.token = generateAuthToken(user._id);

            // Lưu user vào database      
            const newUser = await user.save();
            res.status(200).json({newUser});

        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Registration failed' });
        }
    },

    // register: async (req, res) => {
    //     const {username, email, password } = req.body;

    //     try {
    //         // Kiểm tra xem email đã tồn tại chưa
    //         const existingUser = await User.findOne({ email });
    //         if (existingUser) {
    //             return res.status(400).json({ error: 'Email already in use' });
    //         }
    
    //         const user = new User({username, email, password });
    //         await user.save();
    //         res.status(201).json({ message: 'User registered successfully' });
    //     } catch (err) {
    //         console.error('Error during registration:', err.message); // Thêm dòng này để ghi lại lỗi
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // },

    // đăng nhập
    login: async (req, res) => {
        try {
            const user = await md.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            
            // So sánh mật khẩu người dùng với mật khẩu trong database
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }
            
            // Tạo token xác thực cho user đã đăng nhập bng hàm generateAuthToken
            user.token = generateAuthToken(user._id);
            
            // Lưu user vào database
            await user.save();
            if (user) {
                res.status(200).json({ 
                    user: { id: user._id, username: user.username, email: user.email },
                    token: user.token
                });
            } else {
                res.status(400).json({ message: 'Login failed' });
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    // login: async (req, res) => {
    //     const { email, password } = req.body;

    // try {
    //     // Kiểm tra xem người dùng có tồn tại
    //     const user = await User.findOne({ email });
    //     if (!user) {
    //         console.error('User not found');
    //         return res.status(404).json({ error: 'User not found' });
    //     }

    //     // Kiểm tra mật khẩu
    //     const isPasswordValid = await bcrypt.compare(password, user.password);
    //     if (!isPasswordValid) {
    //         console.error('Invalid password');
    //         return res.status(400).json({ error: 'Invalid password' });
    //     }

    //     // Tạo token JWT
    //     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    //     res.status(200).json({ token });
    // } catch (err) {
    //     console.error('Error during login:', err.message);
    //     res.status(500).json({ error: 'Internal server error' });
    // }
    // },

    // đăng xuất
    logout: async (req, res) => {
        // Xóa refresh token khỏi mảng và xóa cookie
        // sử dụng logout với post
        // refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
        
        // res.clearCookie('refreshtoken');
        // res.json({ message: 'User logged out' });

        // sử dụng logot với get
        try {
            console.log(req.user);
            req.user.token = null;
            await req.user.save();
            res.json({ message: 'User logged out' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

}