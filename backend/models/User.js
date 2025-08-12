const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['teacher','student', 'admin'],
        default: 'student',
    },
    // Profile Information
    profileImage: {
        type: String,
        default: '',
    },
    // Security Settings
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    activeSessions: [{
        sessionId: String,
        deviceInfo: String,
        ipAddress: String,
        lastActive: Date,
        createdAt: { type: Date, default: Date.now }
    }],
    // User Preferences
    preferences: {
        language: {
            type: String,
            enum: ['en', 'fr', 'es', 'ar'],
            default: 'en',
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system',
        },
        emailNotifications: {
            type: Boolean,
            default: true,
        },
        courseRecommendations: {
            type: Boolean,
            default: true,
        },
    },
    // Course Management
    enrolledCourses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress: { type: Number, default: 0 },
        enrolledAt: { type: Date, default: Date.now },
    }],
    completedCourses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        completedAt: { type: Date, default: Date.now },
    }],
    // Timestamps
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// 🔹 Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password not changed
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 🔹 Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
