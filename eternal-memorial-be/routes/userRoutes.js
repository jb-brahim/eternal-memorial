
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Get current user profile
router.get('/me', auth, async (req, res) => {
	res.json({
		id: req.user._id,
		name: req.user.name,
		email: req.user.email,
		role: req.user.role,
		avatarUrl: req.user.avatarUrl
	});
});

// Update current user profile
router.put('/me', auth, async (req, res) => {
	try {
		const { name, avatarUrl } = req.body;
		if (name) req.user.name = name;
		if (avatarUrl) req.user.avatarUrl = avatarUrl;
		await req.user.save();
		res.json({ message: 'Profile updated', user: {
			id: req.user._id,
			name: req.user.name,
			email: req.user.email,
			role: req.user.role,
			avatarUrl: req.user.avatarUrl
		}});
	} catch (err) {
		res.status(500).json({ message: 'Profile update failed', error: err.message });
	}
});

module.exports = router;
