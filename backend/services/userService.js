const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { cleanupExpiredSessions } = require('../utils/sessionUtils');

// Create a new user
const createUser = async (userData) => {
    try {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        const user = new User(userData);
        return await user.save();
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

// Get all users with pagination
const getAllUsers = async (page = 1, limit = 10) => {
    try {
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));

        return await User.find()
            .select('-password')
            .skip((page - 1) * limit)
            .limit(limit);
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
};

// Get a user by email
const getUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error(`Error fetching user by email: ${error.message}`);
    }
};

// Get user by ID
const getUserById = async (userId) => {
    try {
        return await User.findById(userId).select('-password');
    } catch (error) {
        throw new Error(`Error fetching user by ID: ${error.message}`);
    }
};

// Update user profile
const updateUserProfile = async (userId, updateData) => {
    try {
        const { name, profileImage } = updateData;
        
        const updateFields = {
            lastUpdated: new Date(),
        };
        
        if (name) updateFields.name = name;
        if (profileImage !== undefined) updateFields.profileImage = profileImage;
        
        const user = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    } catch (error) {
        throw new Error(`Error updating user profile: ${error.message}`);
    }
};

// Change user password
const changeUserPassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        // Verify old password
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }
        
        // Validate new password
        if (newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters long');
        }
        
        // Update password
        user.password = newPassword;
        user.lastUpdated = new Date();
        await user.save();
        
        return { message: 'Password updated successfully' };
    } catch (error) {
        throw new Error(`Error changing password: ${error.message}`);
    }
};

// Update user preferences
const updateUserPreferences = async (userId, preferences) => {
    try {
        const updateFields = {
            preferences: preferences,
            lastUpdated: new Date(),
        };
        
        const user = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    } catch (error) {
        throw new Error(`Error updating preferences: ${error.message}`);
    }
};

// Toggle two-factor authentication
const toggleTwoFactor = async (userId, enabled) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                twoFactorEnabled: enabled,
                lastUpdated: new Date(),
            },
            { new: true }
        ).select('-password');
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    } catch (error) {
        throw new Error(`Error updating two-factor authentication: ${error.message}`);
    }
};

// Add user session
const addUserSession = async (userId, sessionInfo) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        // Clean up old sessions and add new one
        user.activeSessions = cleanupExpiredSessions(user.activeSessions || []);
        user.activeSessions.push(sessionInfo);
        
        // Keep only last 10 sessions
        if (user.activeSessions.length > 10) {
            user.activeSessions = user.activeSessions.slice(-10);
        }
        
        await user.save();
        return sessionInfo.sessionId;
    } catch (error) {
        throw new Error(`Error adding session: ${error.message}`);
    }
};

// Logout from all devices
const logoutAllDevices = async (userId, currentSessionId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        // Keep only the current session
        user.activeSessions = user.activeSessions.filter(session => 
            session.sessionId === currentSessionId
        );
        
        await user.save();
        
        return { message: 'Logged out from all other devices successfully' };
    } catch (error) {
        throw new Error(`Error logging out from all devices: ${error.message}`);
    }
};

// Clear user progress
const clearUserProgress = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'enrolledCourses.$[].progress': 0,
                },
                $unset: {
                    completedCourses: 1,
                },
                lastUpdated: new Date(),
            },
            { new: true }
        ).select('-password');
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Also reset the completedCourses array to empty
        user.completedCourses = [];
        await user.save();
        
        return { message: 'User progress cleared successfully' };
    } catch (error) {
        throw new Error(`Error clearing user progress: ${error.message}`);
    }
};

// Delete user account
const deleteUserAccount = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return { message: 'User account deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting user account: ${error.message}`);
    }
};

// Store password reset token (simple implementation - in production use Redis or separate collection)
const storePasswordResetToken = async (userId, resetToken) => {
    try {
        // For now, we'll store it in memory (use Redis in production)
        global.passwordResetTokens = global.passwordResetTokens || new Map();
        
        const tokenData = {
            token: resetToken,
            expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
            userId: userId
        };
        
        global.passwordResetTokens.set(userId, tokenData);
        
        return true;
    } catch (error) {
        throw new Error(`Error storing password reset token: ${error.message}`);
    }
};

// Verify password reset token
const verifyPasswordResetToken = async (token) => {
    try {
        global.passwordResetTokens = global.passwordResetTokens || new Map();
        
        // Find token in stored tokens
        for (const [userId, tokenData] of global.passwordResetTokens) {
            if (tokenData.token === token) {
                // Check if token has expired
                if (Date.now() > tokenData.expiresAt) {
                    global.passwordResetTokens.delete(userId);
                    throw new Error('Password reset token has expired');
                }
                
                return { userId, valid: true };
            }
        }
        
        throw new Error('Invalid password reset token');
    } catch (error) {
        throw new Error(`Error verifying password reset token: ${error.message}`);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    getUserById,
    updateUserProfile,
    changeUserPassword,
    updateUserPreferences,
    toggleTwoFactor,
    addUserSession,
    logoutAllDevices,
    clearUserProgress,
    deleteUserAccount,
    storePasswordResetToken,
    verifyPasswordResetToken,
};
