const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpire: { type: Date, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('OTP', OTPSchema);
