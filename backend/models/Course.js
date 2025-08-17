const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['programming', 'design', 'business', 'marketing', 'science', 'language', 'other'],
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    duration: {
        type: Number, // in hours
        required: true,
        min: 1,
    },
    thumbnail: {
        type: String,
        default: '',
    },
    tags: [{
        type: String,
        trim: true,
    }],
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    }],
    enrolledStudents: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    reviews: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            maxlength: 500,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Index for better search performance
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ 'rating.average': -1 });

// Virtual for total enrolled students count
courseSchema.virtual('totalEnrolled').get(function() {
    return this.enrolledStudents.length;
});

// Pre-save middleware to update publishedAt when isPublished changes to true
courseSchema.pre('save', function(next) {
    if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('Course', courseSchema);
