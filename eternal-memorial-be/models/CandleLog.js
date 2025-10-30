const mongoose = require('mongoose');

const candleLogSchema = new mongoose.Schema({
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
    ipAddress: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for faster queries and analytics
candleLogSchema.index({ memorialId: 1 });
candleLogSchema.index({ userId: 1 });
candleLogSchema.index({ timestamp: -1 });

// Pre-save middleware to update memorial's candle count
candleLogSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            await mongoose.model('Memorial').findByIdAndUpdate(
                this.memorialId,
                { $inc: { candleCount: 1 } }
            );
        } catch (error) {
            next(error);
        }
    }
    next();
});

// Static method to get candle stats for a memorial
candleLogSchema.statics.getStats = async function(memorialId, startDate, endDate) {
    const match = {
        memorialId: mongoose.Types.ObjectId(memorialId)
    };

    if (startDate && endDate) {
        match.timestamp = {
            $gte: startDate,
            $lte: endDate
        };
    }

    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

const CandleLog = mongoose.model('CandleLog', candleLogSchema);

module.exports = CandleLog;