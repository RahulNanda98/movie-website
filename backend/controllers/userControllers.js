const User = require('../database/Schema')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

dotenv.config();

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // const useremail = await User.findOne({ email })
        // if (useremail) {
        //     return res.json({ status: false, message: 'Email already exists' })
        // }

        // const name = await User.findOne({ username })
        // if (name) {
        //     return res.json({ status: false, message: 'username already exists' })
        // }
        const existingUser = await User.findOne({ $or: [{ email, username }] })

        if (existingUser) {
            if (existingUser.email === email) {
                return res.json({ status: false, message: 'Email already exists' })
            } else if (existingUser.username === username) {
                return res.json({ status: false, message: 'username already exists' })
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.json({ status: true, message: 'Signup Successful' })
    } catch (error) {
        console.error('Error during signup:', error);
        return res.json({ status: false, message: 'Internal server error' });
    }
};

const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ status: false, message: 'Invalid user' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            const token = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 3600000
            });
            return res.json({ status: true, message: "Login successful", userData: user.username });
        } else {
            return res.json({ status: false, message: 'Wrong credentials' });
        }
    } catch (err) {
        console.error('An error occurred during login:', err);
        return res.json({ status: false, message: 'Internal server error' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ status: false, message: 'Invalid email' })
        }

        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        var mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            html: `
                  <p>You requested a password reset. Click the link below to reset your password:</p>
                  <a href="http://localhost:5173/resetpassword/${token}">Reset Password</a>
                  <p>This link will expire in 5 minutes.</p>
                  `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("error while sending email", error)
                return res.json({ status: false, message: 'Error while sending email' });
            } else {
                return res.json({ status: true, message: 'Check your email for reset password link' });
            }
        });
    } catch (err) {
        console.error('Error during password reset request:', err);
        return res.json({ status: false, message: 'Internal server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const password = req.body.confirmPassword;

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id = decoded.id;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
        return res.json({ status: true, message: 'Password reset successful' });
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.json({ status: false, message: 'Token expired' });
        } else if (err.name === "JsonWebTokenError") {
            return res.json({ status: false, message: 'Invalid token' });
        } else {
            return res.json({ status: false, message: 'An error occured' });
        }
    }
};

const verifyToken = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.json({ status: false, message: "no token" })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.json({ status: false, message: "Invalid or expired token" });
    }
};

const protectedRoute = (req, res) => {
    return res.json({ status: true, message: "Access granted" });
};

const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        return res.json({ status: true, message: 'Logout successful' });
    } catch (err) {
        console.error('Error occurred during logout:', err);
        return res.json({ status: false, message: "error occured" });
    }
};

const verifyUser = (req, res) => {
    if (req.user) {
        return res.status(200).json({ status: true, userData: req.user });
    } else {
        return res.json({ status: false, message: "User not authenticated" });
    }
};

module.exports = {
    registerUser,
    userLogin,
    forgotPassword,
    resetPassword,
    verifyToken,
    protectedRoute,
    logout,
    verifyUser
}