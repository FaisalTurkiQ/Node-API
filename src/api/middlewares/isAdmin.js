const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.sendError({
                code: 404,
                message: "User not found",
                details: "No user exists with the provided ID"
            }, 404);
        }

        if (user.role !== 'admin') {
            return res.sendError({
                code: 403,
                message: "Access denied",
                details: "This action requires admin privileges"
            }, 403);
        }

        req.user = user;
        next();
    } catch (error) {
        res.sendError({
            message: "Authentication failed",
            details: "Failed to verify the authentication token",
            code: 401
        }, 401);
    }
};

module.exports = isAdmin;
