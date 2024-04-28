const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 

const auth = async (req, res, next) => {
    try {
        const header = req.header('Authorization');
        if (!header) {
            // If no Authorization header is present, send an error
            return res.sendError({
                code: 401,
                message: 'No authentication token provided.',
                details: 'Authorization header is missing. Please include a bearer token in your request headers.'
            }, 401);
        }

        const token = header.replace('Bearer ', '');
        if (!token) {
            return res.sendError({
                code: 401,
                message: 'No authentication token provided.',
                details: 'Please include a bearer token in your request headers.'
            }, 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.sendError({
                code: 401,
                message: 'Authentication failed. User not found.',
                details: 'The token provided does not match any active user.'
            }, 401);
        }

        if (!user.isVerified) {
            return res.sendError({
                code: 401,
                message: 'Your account has not been verified.',
                details: 'Please verify your account to access this resource.'
            }, 401);
        }

        req.user = user;  // Now req.user is the whole user document
        next();
    } catch (error) {
        res.sendError({
            code: 401,
            message: 'Please authenticate.',
            details: error.message || 'Failed to process the authentication token.'
        }, 401);
    }
};

module.exports = auth;
