const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewOrderSchema = new Schema({
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id_order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    id_product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('ReviewOrder', ReviewOrderSchema);