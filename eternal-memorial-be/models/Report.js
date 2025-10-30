const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    targetType: {
        type: String,
        enum: ['memorial', 'comment', 'user'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason for the report'],
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'reviewed', 'dismissed'],
        default: 'open'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for faster queries
reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ reporterId: 1 });

// Pre-save middleware to set reviewedAt when status changes to reviewed
reportSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'reviewed') {
        this.reviewedAt = new Date();
    }
    next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;