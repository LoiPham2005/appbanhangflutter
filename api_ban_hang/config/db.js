require('dotenv').config(); 
const mongoose = require('mongoose');

// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
    }
};

module.exports = { connect };