const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    avatar: { type: String, required: false },
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    sex: { type: String, default: '' },
    phone: { type: String, default: '' },
    birth_date: { type: Date, default: Date.now },

    // sex: { type: String, required: false},
    // phone: { type: String, required: false},
    // birth_date: { type: Date, required: false},

    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    accessToken: [
        { type: String } // Lưu danh sách token
    ],
    refreshToken: { 
        type: String, // Token dùng để cấp lại accessToken
        required: false 
    }
}, {
    timestamps: true,
});

// Method to check if user is admin
Users.methods.isAdmin = function() {
    return this.role === 'admin';
};

module.exports = mongoose.model('User', Users);