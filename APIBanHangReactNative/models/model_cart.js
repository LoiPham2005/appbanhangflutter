const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carts = new Schema({
    id_user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    id_product: { type: Schema.Types.ObjectId, ref: 'products', required: false },
    purchaseQuantity: { type: Number, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', carts);
