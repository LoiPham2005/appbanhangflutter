const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['text', 'image'],
        default: 'text' 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
});

const chatSchema = new Schema({
    participants: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    messages: [messageSchema],
    lastMessage: {
        type: messageSchema,
        default: null
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Chat', chatSchema);