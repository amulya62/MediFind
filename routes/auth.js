const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "pharma_secret_key";

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role, phone, address } = req.body;
        
        // 1. Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ msg: "Please enter all required fields" });
        }

        // 2. Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists with this email" });
        }

        // 3. Create and Save User (password hashing happens in Mongoose pre-save hook)
        const newUser = new User({ 
            name, 
            email: email.toLowerCase(), 
            password, 
            role,
            phone: phone || 'Not provided',
            address: address || 'Not provided'
        });
        
        await newUser.save();

        // 4. Generate JWT
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role, email: newUser.email }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            address: newUser.address
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ msg: "Server error during registration", error: err.message });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // 2. Locate User
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // 3. Match Passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // 4. Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ msg: "Server error during login" });
    }
});

module.exports = router;
