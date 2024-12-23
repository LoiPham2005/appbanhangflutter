const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const banner = new Schema({
    homeBanner: { type: String, required: true, unique: true },
    homeBanner1: { type: String, required: true, unique: true },
    homeBanner2: { type: String, required: true, unique: true },
    homeBanner3: { type: String, required: true, unique: true },
    homeBanner4: { type: String, required: true, unique: true },
    homeBanner5: { type: String, required: true, unique: true },
    homeBanner6: { type: String, required: true, unique: true },
    homeBanner7: { type: String, required: true, unique: true },
    disColothing: { type: String, required: true, unique: true },
    disAccess: { type: String, required: true, unique: true },
    disShoes: { type: String, required: true, unique: true },
    disCollection: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('banners', banner);
