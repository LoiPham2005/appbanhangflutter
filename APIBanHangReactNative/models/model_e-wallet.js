const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the e-wallet
const WalletSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    transactions: [{
        transactionId: {
            type: String,  // Thay đổi từ ObjectId sang String
            required: true
        },
        type: {
            type: String,
            enum: ['credit', 'debit'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'completed'
        }
    }]
}, { timestamps: true });

// Export the Wallet model
module.exports = mongoose.model('Wallet', WalletSchema);