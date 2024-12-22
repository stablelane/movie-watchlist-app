const mongoose = require('mongoose');

// Define the Task schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

// Create the Task model
const User = mongoose.model('User', userSchema);

module.exports = User;
