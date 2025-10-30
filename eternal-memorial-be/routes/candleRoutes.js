
const express = require('express');
const router = express.Router();
// TODO: Import CandleLog model and auth middleware


const CandleLog = require('../models/CandleLog');

// Light a candle on a memorial
router.post('/:id/candles', async (req, res) => {
	try {
		const { userId, ipAddress } = req.body;
		if (!userId) {
			return res.status(400).json({ message: 'userId is required.' });
		}
		const candle = new CandleLog({
			memorialId: req.params.id,
			userId,
			ipAddress
		});
		await candle.save();
		res.status(201).json(candle);
	} catch (err) {
		res.status(500).json({ message: 'Failed to light candle', error: err.message });
	}
});


// Get candle statistics (admin)
router.get('/:id/candles/stats', async (req, res) => {
	try {
		const stats = await CandleLog.getStats(req.params.id);
		res.json(stats);
	} catch (err) {
		res.status(500).json({ message: 'Failed to get candle stats', error: err.message });
	}
});

module.exports = router;
