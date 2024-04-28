const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
              return /^[a-zA-Z0-9._-]{3,29}$/.test(value); // Matches English letters, numbers, ".", "-", and "_", 3-29 characters
            },
            message: props => `${props.value} is not a valid username. It must be English letters only, longer than 2 and shorter than 30 characters, and contain no numbers or symbols.`
        }
    },
    displayName: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
              return /^[a-zA-Z\s']{3,50}$/.test(value); // Matches English letters, spaces, and apostrophes only, 3-50 characters
            },
            message: props => `${props.value} is not a valid display name. It must be English letters, spaces, or apostrophes only, between 3 and 50 characters.`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Matches correct email format
            },
            message: props => `${props.value} is not a valid email address.`
        }
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetToken: String,
    resetTokenExpires: Date,
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
},{timestamps: true});


module.exports = mongoose.model('User', userSchema);
