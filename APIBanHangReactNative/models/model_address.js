const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const address = new Schema({
    fullName: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    commune: { type: String, required: true },
    receivingAddress: { type: String, required: true },
    phone: { type: Number, required: true },
    id_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('address', address);

