
const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');


// Get comments for a memorial
router.get('/:id/comments', async (req, res) => {
	try {
		const comments = await Comment.find({ memorial: req.params.id });
		res.json(comments);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
	}
});


// Add comment to a memorial
router.post('/:id/comments', async (req, res) => {
	try {
		const { userId, content } = req.body;
		if (!userId || !content) {
			return res.status(400).json({ message: 'userId and content are required.' });
		}
		const comment = new Comment({
			memorialId: req.params.id,
			userId,
			content
		});
		await comment.save();
		res.status(201).json(comment);
	} catch (err) {
		res.status(500).json({ message: 'Failed to add comment', error: err.message });
	}
});

// Edit comment
router.put('/:id/comments/:commentId', (req, res) => {
	// ...implement edit comment
	res.json({ message: 'Edit comment (not implemented)' });
});

// Delete comment
router.delete('/:id/comments/:commentId', (req, res) => {
	// ...implement delete comment
	res.json({ message: 'Delete comment (not implemented)' });
});

module.exports = router;
