// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const sendEmail = require('../services/emailServices');
const crypto = require('crypto');

exports.registerUser = async (req, res,next) => {
    try {
        const { username,displayName, email, password } = req.body;
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        const user = new User({
            username,
            displayName,
            email,
            password,
            verificationToken,
            verificationTokenExpires,
        });

        await user.save();

        const verificationUrl = `http://${req.headers.host}/api/auth/verify/${verificationToken}`;
        const message = `Please click on the following link to verify your email address: ${verificationUrl}`;

        // Sending the verification email
        await sendEmail({
            to: email,
            subject: 'Verify Your Email Address',
            text: message,
            html: `<p>Please click on the following link to verify your email address: <a href="${verificationUrl}">Verify Email</a></p>`
        });
        

        // Use res.sendData for a successful response
        res.sendData({
            message: "Registration successful, please check your email for verification instructions."
        }, "Registration successful, please check your email for verification instructions.");
    } catch (error) {
        // Use res.sendError for handling errors
        next(error)
    }
};

exports.loginUser = async (req, res,next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.sendError({
                code: 404,
                message: 'User not found',
                details: 'No user found with the provided username'
            }, 404);
        }

    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.sendError({
                code: 401,
                message: 'Invalid credentials',
                details: 'Password does not match'
            }, 401);
        }
        // Check if the user has been verified
        if (!user.isVerified) {
            return res.sendError({
                code: 403,
                message: 'Account not verified',
                details: 'Please verify your account to log in'
            }, 403);
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send token
        res.sendData({ token }, 'Logged in successfully');
    } catch (error) {
        next(error)
    }
};

exports.verifyUser = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        let error; // Define the error variable

        if (!user) {
            // If user is not found, set the error object
            error = {
                code: 400,
                message: "Token is invalid or has expired",
                details: "The provided token is either incorrect or it has expired, please request a new verification link."
            };
        } else {
            // If user is found and verified successfully, update user and render success message
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpires = undefined;
            await user.save();
        }

        // Render the verification HTML template with the error (if exists)
        res.render('verification-success', { error });

    } catch (error) {
        next(error)
    }
};


exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.sendError({
                code: 404,
                message: 'User not found',
                details: 'No user found with the provided email'
            }, 404);
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        const resetUrl = `http://${req.headers.host}/api/auth/reset-password/${resetToken}`;
        const message = `Please click on the following link to reset your password: ${resetUrl}`;

        await sendEmail({
            to: email,
            subject: 'Password Reset Request',
            text: message,
            html: `<p>Please click on the following link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`
        });

        res.render('forgot-password', { successMessage: req.query.success });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.sendError({
                code: 400,
                message: "Token is invalid or has expired",
                details: "The reset token is either incorrect or it has expired."
            }, 400);
        }

        // Hash the new password before saving
        user.password = password
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        res.sendData({ message: "Password has been reset successfully." });
    } catch (error) {
        next(error);
    }
};

exports.generateVerifyToken = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.sendError({
                code: 404,
                message: 'User not found',
                details: 'No user found with the provided email'
            }, 404);
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        const verificationUrl = `http://${req.headers.host}/api/auth/verify/${verificationToken}`;
        const message = `Please click on the following link to verify your email address: ${verificationUrl}`;

        // Sending the verification email
        await sendEmail({
            to: email,
            subject: 'Verify Your Email Address',
            text: message,
            html: `<p>Please click on the following link to verify your email address: <a href="${verificationUrl}">Verify Email</a></p>`
        });

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        res.sendData({}, 'Verification token generated successfully and sent to email');
    } catch (error) {
        next(error);
    }
};