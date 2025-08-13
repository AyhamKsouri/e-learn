const UserService = require('../services/userService');
const generateToken = require('../utils/generateToken');
const { createSessionInfo } = require('../utils/sessionUtils');
const emailService = require('../services/emailService');
const twoFactorService = require('../services/twoFactorService');

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const user = await UserService.createUser({ name, email, password, role });

        // Send welcome email if email notifications are enabled
        if (user.preferences.emailNotifications) {
            try {
                await emailService.sendWelcomeEmail(user.email, user.name);
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail registration if email fails
            }
        }

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

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            // Generate and send 2FA code
            try {
                const result = await twoFactorService.generateCode(user._id, user.email, user.name);
                return res.json({
                    message: result.message,
                    requires2FA: true,
                    userId: user._id,
                    email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Masked email
                });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }

        // Create session for login (non-2FA users)
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
        
        // Send notification preference confirmation email if email notifications were just enabled
        if (filteredPreferences.emailNotifications === true && req.user.preferences?.emailNotifications !== true) {
            try {
                await emailService.sendCourseNotification(
                    user.email, 
                    user.name, 
                    'preference_update',
                    { message: 'Email notifications have been enabled for your account.' }
                );
            } catch (emailError) {
                console.error('Failed to send preference update email:', emailError);
            }
        }
        
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

// Verify 2FA code and complete login
const verify2FA = async (req, res) => {
    try {
        const { userId, code } = req.body;
        
        if (!userId || !code) {
            return res.status(400).json({ message: 'User ID and verification code are required' });
        }
        
        // Verify the code
        const verificationResult = twoFactorService.verifyCode(userId, code);
        
        if (!verificationResult.success) {
            return res.status(400).json({ message: verificationResult.message });
        }
        
        // Get user and create session
        const user = await UserService.getUserById(userId);
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

// Resend 2FA code
const resend2FACode = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        // Get user info
        const user = await UserService.getUserById(userId);
        
        // Resend code
        const result = await twoFactorService.resendCode(userId, user.email, user.name);
        
        if (!result.success) {
            return res.status(429).json({ message: result.message });
        }
        
        res.json({ message: result.message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get 2FA verification status
const get2FAStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const status = twoFactorService.getVerificationStatus(userId);
        res.json(status);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        // Get user by email
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({ message: 'If the email exists, a password reset link has been sent.' });
        }
        
        // Generate reset token
        const resetToken = emailService.generateEmailToken();
        
        // Store reset token (you might want to add this to user model or separate collection)
        // For now, we'll use the 2FA service to store it temporarily
        await UserService.storePasswordResetToken(user._id, resetToken);
        
        // Send password reset email
        try {
            await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            return res.status(500).json({ message: 'Failed to send password reset email' });
        }
        
        res.json({ message: 'If the email exists, a password reset link has been sent.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Send test email (for development)
const sendTestEmail = async (req, res) => {
    try {
        // Only allow in development
        if (process.env.NODE_ENV !== 'development') {
            return res.status(403).json({ message: 'Test emails only available in development mode' });
        }
        
        const { type, email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        let result;
        switch (type) {
            case 'welcome':
                result = await emailService.sendWelcomeEmail(email, 'Test User');
                break;
            case '2fa':
                result = await emailService.send2FACode(email, '123456', 'Test User');
                break;
            case 'course':
                result = await emailService.sendCourseNotification(email, 'Test User', 'enrollment', {
                    title: 'Test Course',
                    id: 'test123',
                    lessons: 10
                });
                break;
            default:
                return res.status(400).json({ message: 'Invalid email type' });
        }
        
        res.json({ 
            message: `Test ${type} email sent successfully`,
            messageId: result.messageId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    verify2FA,
    resend2FACode,
    get2FAStatus,
    requestPasswordReset,
    sendTestEmail,
};
