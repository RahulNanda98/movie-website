const express = require('express');
const router = express.Router();
const { registerUser, userLogin, forgotPassword, resetPassword, protectedRoute, logout, verifyUser, verifyToken } = require('../controllers/userControllers');

router.post('/signup', registerUser);

router.post('/login', userLogin);

router.post('/forgotpassword', forgotPassword);

router.post('/resetpassword/:token', resetPassword);

router.get('/watchlist', verifyToken, protectedRoute);

router.get('/logout', logout);

router.get('/checkuser', verifyToken, verifyUser);

module.exports = router
