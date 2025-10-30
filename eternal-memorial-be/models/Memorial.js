const mongoose = require('mongoose');
const slugify = require('slugify');

const memorialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide the name of the deceased'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    birthDate: {
        type: Date
    },
    deathDate: {
        type: Date
    },
    story: {
        type: String,
        required: [true, 'Please provide a story or memory'],
        trim: true
    },
    photos: [{
        type: String // Array of image URLs
    }],
    privacy: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    candleCount: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            return ret;
        }
    }
});

// Indexes for faster queries
memorialSchema.index({ userId: 1 });
memorialSchema.index({ slug: 1 });
memorialSchema.index({ name: 'text', story: 'text' }); // Text index for search

// Pre-save middleware to generate slug
memorialSchema.pre('save', function(next) {
    if (!this.isModified('name')) return next();
    
    // Generate slug from name and add timestamp to ensure uniqueness
    this.slug = slugify(`${this.name}-${Date.now()}`, { lower: true });
    next();
});

// Virtual for formatted dates
memorialSchema.virtual('birthDateFormatted').get(function() {
    return this.birthDate ? this.birthDate.toLocaleDateString() : 'Unknown';
});

memorialSchema.virtual('deathDateFormatted').get(function() {
    return this.deathDate ? this.deathDate.toLocaleDateString() : 'Unknown';
});

// Method to check if a user has permission to view this memorial
memorialSchema.methods.canView = function(userId) {
    return this.privacy === 'public' || this.userId.equals(userId);
};

const Memorial = mongoose.model('Memorial', memorialSchema);

module.exports = Memorial;