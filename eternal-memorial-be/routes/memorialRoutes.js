
const express = require('express');
const router = express.Router();

const Memorial = require('../models/Memorial');
const CandleLog = require('../models/CandleLog');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const { uploadImage, getImageUrl } = require('../utils/cloudinary');


// Create memorial
// Accept multipart/form-data for photos using uploadMiddleware
router.post('/', uploadMiddleware, async (req, res) => {
	try {
		// multer will populate req.body and req.files
		const { userId, name, story, birthDate, deathDate, privacy } = req.body || {};
		if (!userId || !name || !story) {
			return res.status(400).json({ message: 'userId, name, and story are required.' });
		}

		// Handle uploaded files (req.files) and upload to Cloudinary
		let photos = [];
		if (req.files && req.files.length > 0) {
			try {
				// Try to upload each photo, but don't fail the whole request if uploads fail
				const uploadPromises = req.files.map(async (file) => {
					try {
						return await uploadImage(file);
					} catch (err) {
						console.error('Photo upload failed:', err);
						return null;
					}
				});
				photos = (await Promise.all(uploadPromises)).filter(url => url);
			} catch (err) {
				console.error('Photo upload batch failed:', err);
				// Continue with empty photos array
			}
		}

		const memorial = new Memorial({
			userId,
			name,
			story,
			birthDate,
			deathDate,
			photos,
			privacy
		});
		await memorial.save();
		res.status(201).json(memorial);
	} catch (err) {
		console.error('Create memorial error:', err);
		res.status(500).json({ message: 'Failed to create memorial', error: err.message });
	}
});


// List/search memorials
router.get('/', async (req, res) => {
	try {
		const memorials = await Memorial.find()
			.populate('userId', 'name')
			.lean();

		// Get candle counts for all memorials
		const memorialIds = memorials.map(m => m._id);
		const candleCounts = await CandleLog.aggregate([
			{ $match: { memorialId: { $in: memorialIds } } },
			{ $group: { _id: '$memorialId', count: { $sum: 1 } } }
		]);

		// Create a map of memorial ID to candle count
		const candleCountMap = candleCounts.reduce((acc, curr) => {
			acc[curr._id] = curr.count;
			return acc;
		}, {});

		// Add candle count and process photos for each memorial
		const memorialsWithCounts = memorials.map(memorial => ({
			...memorial,
			createdBy: memorial.userId.name,
			candleCount: candleCountMap[memorial._id] || 0,
			photos: memorial.photos?.map(photo => getImageUrl(photo)) || []
		}));

		res.json(memorialsWithCounts);
	} catch (err) {
		console.error('Fetch memorials error:', err);
		res.status(500).json({ message: 'Failed to fetch memorials', error: err.message });
	}
});


// Get memorial details
router.get('/:id', async (req, res) => {
	try {
		const memorial = await Memorial.findById(req.params.id);
		if (!memorial) return res.status(404).json({ message: 'Memorial not found' });
		res.json(memorial);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch memorial', error: err.message });
	}
});

// Update memorial
router.put('/:id', (req, res) => {
	// ...implement memorial update
	res.json({ message: 'Update memorial (not implemented)' });
});

// Delete memorial
router.delete('/:id', (req, res) => {
	// ...implement memorial deletion
	res.json({ message: 'Delete memorial (not implemented)' });
});

module.exports = router;
