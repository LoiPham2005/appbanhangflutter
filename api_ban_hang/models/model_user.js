const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    token: {  // trường hợp lưu nhiều token thì phải dùng mảng. Trong demo này sẽ dùng 1 token
        type: String, required: false
    }
}, {
    timestamps: true,
});

// Method to check if user is admin
Users.methods.isAdmin = function() {
    return this.role === 'admin';
};

module.exports = mongoose.model('User', Users);