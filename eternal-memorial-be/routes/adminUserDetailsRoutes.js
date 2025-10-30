const express = require('express');
const router = express.Router();
const Memorial = require('../models/Memorial');
const Comment = require('../models/Comment');
const CandleLog = require('../models/CandleLog');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Get user's memorials
router.get('/users/:userId/memorials', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    console.log('Fetching memorials for user:', req.params.userId);
    
    if (!req.params.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const memorials = await Memorial.find({ userId: req.params.userId })
      .select('title description createdAt')
      .sort({ createdAt: -1 });

    console.log('Found memorials:', memorials.length);
    res.json(memorials);
  } catch (error) {
    console.error('Error fetching memorials:', error);
    res.status(500).json({ 
      message: 'Error fetching memorials', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get user's comments
router.get('/users/:userId/comments', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    console.log('Fetching comments for user:', req.params.userId);
    
    if (!req.params.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const comments = await Comment.find({ userId: req.params.userId })
      .populate('memorialId', 'title')
      .sort({ createdAt: -1 });
    
    console.log('Found comments:', comments.length);

    const transformedComments = comments.map(comment => {
      // Check if memorialId exists and has been populated
      if (!comment.memorialId) {
        console.log('Warning: Comment without memorial reference:', comment._id);
        return null;
      }

      return {
        _id: comment._id,
        text: comment.content,
        memorialId: comment.memorialId._id,
        memorialTitle: comment.memorialId.title,
        createdAt: comment.createdAt
      };
    }).filter(Boolean); // Remove any null entries
    
    res.json(transformedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      message: 'Error fetching comments', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get user's candle logs
router.get('/users/:userId/candles', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    console.log('Fetching candles for user:', req.params.userId);
    
    if (!req.params.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const candles = await CandleLog.find({ userId: req.params.userId })
      .populate('memorialId', 'title')
      .sort({ createdAt: -1 });
    
    console.log('Found candles:', candles.length);

    const transformedCandles = candles.map(candle => {
      // Check if memorialId exists and has been populated
      if (!candle.memorialId) {
        console.log('Warning: Candle without memorial reference:', candle._id);
        return null;
      }

      return {
        _id: candle._id,
        memorialId: candle.memorialId._id,
        memorialTitle: candle.memorialId.title,
        createdAt: candle.createdAt
      };
    }).filter(Boolean); // Remove any null entries
    
    res.json(transformedCandles);
  } catch (error) {
    console.error('Error fetching candle logs:', error);
    res.status(500).json({ 
      message: 'Error fetching candle logs', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;