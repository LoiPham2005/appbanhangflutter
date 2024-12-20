const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const products = new Schema({
    image: { type: String, required: true }, // Ảnh sản phẩm
    title: { type: String, required: true }, // Tên sản phẩm
    brand: { type: String, required: true }, // Thương hiệu
    price: { type: Number, required: true }, // Giá sản phẩm
    description: { type: String, required: true }, // Mô tả chi tiết
    size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true }, // Kích cỡ
    color: { type: String, required: true }, // Màu sắc
    material: { type: String, required: true }, // Chất liệu
    stock_quantity: { type: Number, required: true }, // Số lượng hàng tồn kho
    id_category: { type: Schema.Types.ObjectId, ref: 'category', required: true }, // Danh mục sản phẩm
    status: { 
        type: String, 
        enum: ['active', 'out of stock', 'discontinued'], 
        default: 'active' 
    } // Trạng thái sản phẩm
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('products', products);
