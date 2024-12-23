const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Correct import path
require('dotenv').config();
const rateLimit = require('express-rate-limit');

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

const router = express.Router();

// Signup Route
router.post('/signup', limiter, async (req, res) => {
    console.log(req.body); 
    const { username, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Signin Route
router.post('/signin', limiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Sign-In Request Received:', { email, password });

        // Check if the user exists
        const user = await User.findOne({ email });
        console.log('User Found:', user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Use SECRET_KEY from .env for signing the token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Sign in successful.', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
