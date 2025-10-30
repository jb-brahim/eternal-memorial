const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    memorialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Memorial',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Comment cannot be empty'],
        trim: true
    },
    isHidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for faster queries
commentSchema.index({ memorialId: 1 });
commentSchema.index({ userId: 1 });

// Pre-save middleware to update memorial's comment count
commentSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            await mongoose.model('Memorial').findByIdAndUpdate(
                this.memorialId,
                { $inc: { commentsCount: 1 } }
            );
        } catch (error) {
            next(error);
        }
    }
    next();
});

// Pre-remove middleware to update memorial's comment count
commentSchema.pre('remove', async function(next) {
    try {
        await mongoose.model('Memorial').findByIdAndUpdate(
            this.memorialId,
            { $inc: { commentsCount: -1 } }
        );
    } catch (error) {
        next(error);
    }
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;