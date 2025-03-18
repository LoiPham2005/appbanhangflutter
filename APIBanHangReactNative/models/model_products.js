const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const products = new Schema({
    // images: [{ type: String, required: true }], // Array of images
    // Thêm trường media để lưu cả ảnh và video
    media: [{
        type: { 
            type: String, 
            enum: ['image', 'video'],
            required: false 
        },
        url: { 
            type: String, 
            required: false 
        }
    }],
    title: { type: String, required: true },
    // author: { type: String, required: true },
    publishing_house: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock_quantity: { type: Number, required: true },
    id_category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    status: { 
        type: String, 
        enum: ['active', 'out of stock', 'importing goods', 'stop selling'], 
        default: 'active' 
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('products', products);