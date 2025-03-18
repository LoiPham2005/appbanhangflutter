const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: false, // Optional
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"], // Allowed values
        required: true,
        default: "percentage",
    },
    discountValue: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0; // Ensure positive discount value
            },
            message: "Discount value must be greater than 0.",
        },
    },
    condition: {
        type: String,
        required: false, // Optional
        default: "No conditions",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate; // End date must be after start date
            },
            message: "End date must be after the start date.",
        },
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets creation date
    },
});

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
