const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/verify/', authController.generateVerifyToken);
router.get('/verify/:token', authController.verifyUser);
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password',{ successMessage: req.query.success })
});
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    res.render('reset-password', { token });
});
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
