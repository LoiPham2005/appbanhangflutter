const jwt = require('jsonwebtoken');
const md = require('../models/model_user');
require('dotenv').config();

const chuoi_bi_mat = process.env.TOKEN_SEC_KEY;

const api_auth = async (req, res, next) => {
    let header_token = req.header('Authorization');

    if (typeof(header_token) == 'undefined') {
        return res.status(403).json({ message: 'Vui lòng đăng nhập để truy cập API.' });
    }

    const token = header_token.replace('Bearer ', '');
    
    try {
        const data = jwt.verify(token, chuoi_bi_mat);
        
        const user = await md.userModel.findOne({ _id: data._id, token: token });
        
        if (!user) {
            console.log('Token không hợp lệ: Không tìm thấy người dùng.');
            return res.status(403).json({ message: 'Token không hợp lệ.' });
        }
        
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ 2.' });
    }
}

module.exports = {api_auth};