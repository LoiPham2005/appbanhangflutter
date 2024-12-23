const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const products = new Schema({
    images: [{ type: String, required: true }], // Array of images
    title: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    sizes: [{ 
        type: String, 
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true 
    }], // Array of sizes
    colors: [{ type: String, required: true }], // Array of colors
    material: { type: String, required: true },
    stock_quantity: { type: Number, required: true },
    id_category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    status: { 
        type: String, 
        enum: ['active', 'out of stock', 'discontinued'], 
        default: 'active' 
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('products', products);