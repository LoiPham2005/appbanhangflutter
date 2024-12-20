const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const banner = new Schema({
    homeBanner1: { type: String, required: true, unique: true },
    homeBanner2: { type: String, required: true, unique: true },
    homeBanner3: { type: String, required: true, unique: true },
    homeBanner3: { type: String, required: true, unique: true },
    homeBanner3: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('banners', banner);
