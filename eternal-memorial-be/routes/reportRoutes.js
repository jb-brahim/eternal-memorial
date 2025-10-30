const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new report
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { contentId, contentType, reason, description } = req.body;
        
        if (!contentId || !contentType || !reason) {
            return res.status(400).json({ 
                message: 'Please provide contentId, contentType, and reason' 
            });
        }

        const report = new Report({
            targetId: contentId,
            targetType: contentType === 'memorial' ? 'memorial' : 'comment',
            reporterId: req.user.id,
            reason: reason,
            description: description,
            status: 'open'
        });

        await report.save();

        res.status(201).json(report);
    } catch (err) {
        console.error('Error creating report:', err);
        res.status(500).json({ 
            message: 'Failed to create report', 
            error: err.message 
        });
    }
});

// Get all reports (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const reports = await Report.find()
            .populate('reporterId', 'name email')
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });

        // Fetch additional details for each report
        const populatedReports = await Promise.all(reports.map(async (report) => {
            const reportObj = report.toObject();
            
            if (report.targetType === 'comment') {
                const Comment = require('../models/Comment');
                const comment = await Comment.findById(report.targetId)
                    .populate('userId', 'name email');
                
                if (comment) {
                    reportObj.targetDetails = {
                        content: comment.content,
                        createdAt: comment.createdAt,
                        author: comment.userId
                    };
                }
            } else if (report.targetType === 'memorial') {
                const Memorial = require('../models/Memorial');
                const memorial = await Memorial.findById(report.targetId)
                    .populate('userId', 'name email');
                
                if (memorial) {
                    reportObj.targetDetails = {
                        name: memorial.name,
                        createdAt: memorial.createdAt,
                        author: memorial.userId
                    };
                }
            }
            
            return reportObj;
        }));

        res.json(populatedReports);
    } catch (err) {
        res.status(500).json({ 
            message: 'Failed to fetch reports', 
            error: err.message 
        });
    }
});

// Update report status (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { status } = req.body;
        if (!status || !['open', 'reviewed', 'dismissed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = status;
        if (status === 'reviewed') {
            report.reviewedBy = req.user.id;
            report.reviewedAt = new Date();
        }

        await report.save();
        res.json(report);
    } catch (err) {
        res.status(500).json({ 
            message: 'Failed to update report', 
            error: err.message 
        });
    }
});

module.exports = router;