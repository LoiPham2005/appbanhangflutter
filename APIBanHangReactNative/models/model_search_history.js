const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchHistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    keyword: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add index for better search performance
searchHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);