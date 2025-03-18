const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const banner = new Schema({
    homeBanner: [{ type: String, required: true, unique: true }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('banners', banner);
