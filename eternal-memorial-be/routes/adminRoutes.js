
const express = require('express');
const router = express.Router();

const Memorial = require('../models/Memorial');
const User = require('../models/User');
const Report = require('../models/Report');


// Dashboard stats
router.get('/stats', async (req, res) => {
	try {
		const [userCount, memorialCount, commentCount, candleCount] = await Promise.all([
			User.countDocuments(),
			Memorial.countDocuments(),
			require('../models/Comment').countDocuments(),
			require('../models/CandleLog').countDocuments()
		]);
		res.json({
			users: userCount,
			memorials: memorialCount,
			comments: commentCount,
			candles: candleCount
		});
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
	}
});


// List all memorials
router.get('/memorials', async (req, res) => {
	try {
		const memorials = await Memorial.find();
		res.json(memorials);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch memorials', error: err.message });
	}
});


// List all users
router.get('/users', async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch users', error: err.message });
	}
});

// Ban/unban user
router.put('/users/:id/ban', async (req, res) => {
	try {
		if (!req.params.id) {
			return res.status(400).json({ message: 'User ID is required' });
		}

		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Toggle the ban status
		user.isBanned = !user.isBanned;
		await user.save();

		// Return the updated user
		res.json({
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isBanned: user.isBanned,
			createdAt: user.createdAt
		});
	} catch (err) {
		res.status(500).json({ message: 'Failed to update user', error: err.message });
	}
});

// Delete memorial
router.delete('/memorials/:id', async (req, res) => {
	try {
		const memorial = await Memorial.findById(req.params.id);
		if (!memorial) {
			return res.status(404).json({ message: 'Memorial not found' });
		}
		await memorial.deleteOne();
		res.json({ message: 'Memorial deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Failed to delete memorial', error: err.message });
	}
});

// Delete comment
router.delete('/comments/:id', async (req, res) => {
	try {
		const comment = await require('../models/Comment').findById(req.params.id);
		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}
		await comment.deleteOne();
		res.json({ message: 'Comment deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Failed to delete comment', error: err.message });
	}
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
	try {
		const { role } = req.body;
		if (!role || !['user', 'admin'].includes(role)) {
			return res.status(400).json({ message: 'Invalid role' });
		}
		
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		
		user.role = role;
		await user.save();
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: 'Failed to update user role', error: err.message });
	}
});

// List content reports
router.get('/reports', async (req, res) => {
	try {
		const reports = await Report.find();
		res.json(reports);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
	}
});

// Handle report
router.put('/reports/:id', async (req, res) => {
	try {
		const { status, resolution } = req.body;
		if (!status || !['pending', 'resolved', 'dismissed'].includes(status)) {
			return res.status(400).json({ message: 'Invalid status' });
		}

		const report = await Report.findById(req.params.id);
		if (!report) {
			return res.status(404).json({ message: 'Report not found' });
		}

		report.status = status;
		report.resolution = resolution;
		report.resolvedAt = Date.now();
		report.resolvedBy = req.user.id;
		await report.save();

		res.json(report);
	} catch (err) {
		res.status(500).json({ message: 'Failed to update report', error: err.message });
	}
});

module.exports = router;
