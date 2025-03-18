const jwt = require('jsonwebtoken');
const User = require('../models/model_user'); // Sửa cách import
require('dotenv').config();

const api_auth = async (req, res, next) => {
    try {
        const header_token = req.header('Authorization');

        if (!header_token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = header_token.replace('Bearer ', '');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Sửa cách query
            const user = await User.findOne({
                _id: decoded.id,
                accessToken: token
            });

            if (!user) {
                return res.status(401).json({ message: 'User not found or token invalid' });
            }

            req.user = user;
            req.token = token;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token format' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { api_auth };
