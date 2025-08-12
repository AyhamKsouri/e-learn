const UserService = require('../services/userService');
const generateToken = require('../utils/generateToken');
const { createSessionInfo } = require('../utils/sessionUtils');

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const user = await UserService.createUser({ name, email, password, role });

        // Create session for new user
        const sessionInfo = createSessionInfo(req);
        const sessionId = await UserService.addUserSession(user._id, sessionInfo);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            preferences: user.preferences,
            twoFactorEnabled: user.twoFactorEnabled,
            createdAt: user.createdAt,
            lastUpdated: user.lastUpdated,
            token: generateToken(user._id, sessionId),
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await UserService.getUserByEmail(email);
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create session for login
        const sessionInfo = createSessionInfo(req);
        const sessionId = await UserService.addUserSession(user._id, sessionInfo);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            preferences: user.preferences,
            twoFactorEnabled: user.twoFactorEnabled,
            enrolledCourses: user.enrolledCourses,
            completedCourses: user.completedCourses,
            createdAt: user.createdAt,
            lastUpdated: user.lastUpdated,
            token: generateToken(user._id, sessionId),
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get current user profile
const getMe = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.user._id);
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            preferences: user.preferences,
            twoFactorEnabled: user.twoFactorEnabled,
            enrolledCourses: user.enrolledCourses,
            completedCourses: user.completedCourses,
            activeSessions: user.activeSessions,
            createdAt: user.createdAt,
            lastUpdated: user.lastUpdated,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        let profileImage = req.body.profileImage;
        
        // Handle file upload if present
        if (req.file) {
            // Convert buffer to base64
            profileImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }
        
        const updateData = { name, profileImage };
        const user = await UserService.updateUserProfile(req.user._id, updateData);
        
        res.json({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                preferences: user.preferences,
                twoFactorEnabled: user.twoFactorEnabled,
                lastUpdated: user.lastUpdated,
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old password and new password are required' });
        }
        
        const result = await UserService.changeUserPassword(req.user._id, oldPassword, newPassword);
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update preferences
const updatePreferences = async (req, res) => {
    try {
        const preferences = req.body;
        
        // Validate preferences object
        const allowedPreferences = ['language', 'theme', 'emailNotifications', 'courseRecommendations'];
        const filteredPreferences = {};
        
        Object.keys(preferences).forEach(key => {
            if (allowedPreferences.includes(key)) {
                filteredPreferences[key] = preferences[key];
            }
        });
        
        const user = await UserService.updateUserPreferences(req.user._id, filteredPreferences);
        
        res.json({
            message: 'Preferences updated successfully',
            preferences: user.preferences,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Toggle two-factor authentication
const toggleTwoFactor = async (req, res) => {
    try {
        const { enabled } = req.body;
        
        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ message: 'enabled field must be a boolean' });
        }
        
        const user = await UserService.toggleTwoFactor(req.user._id, enabled);
        
        res.json({
            message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
            twoFactorEnabled: user.twoFactorEnabled,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Logout from all devices
const logoutAllDevices = async (req, res) => {
    try {
        const currentSessionId = req.sessionId;
        
        const result = await UserService.logoutAllDevices(req.user._id, currentSessionId);
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Clear user progress
const clearProgress = async (req, res) => {
    try {
        const result = await UserService.clearUserProgress(req.user._id);
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete user account
const deleteAccount = async (req, res) => {
    try {
        const result = await UserService.deleteUserAccount(req.user._id);
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users (protected)
const getAllUsers = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const users = await UserService.getAllUsers(Number(page) || 1, Number(limit) || 10);
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    changePassword,
    updatePreferences,
    toggleTwoFactor,
    logoutAllDevices,
    clearProgress,
    deleteAccount,
    getAllUsers,
};
