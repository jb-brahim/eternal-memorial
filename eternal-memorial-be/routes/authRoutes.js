
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'Name, email, and password are required.' });
		}
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: 'Email already in use.' });
		}
		const user = new User({ name, email, passwordHash: password });
		await user.save();
		res.status(201).json({ message: 'User registered successfully.' });
	} catch (err) {
		res.status(500).json({ message: 'Registration failed.', error: err.message });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required.' });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}
		const valid = await user.comparePassword(password);
		if (!valid) {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}
		if (user.banned) {
			return res.status(403).json({ message: 'Your account has been banned by an administrator.' });
		}
		const token = jwt.sign(
			{ id: user._id, email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRATION || '7d' }
		);
		res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				avatarUrl: user.avatarUrl
			}
		});
	} catch (err) {
		res.status(500).json({ message: 'Login failed.', error: err.message });
	}
});

module.exports = router;
