const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 2FA routes (public for verification)
router.post('/verify-2fa', verify2FA);
router.post('/resend-2fa', resend2FACode);
router.get('/2fa-status/:userId', get2FAStatus);

// Password reset (public)
router.post('/request-password-reset', requestPasswordReset);

// Development/testing routes
router.post('/send-test-email', sendTestEmail);

// Protected routes - User Profile Management
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('profileImage'), handleMulterError, updateProfile);

// Protected routes - Account Security
router.put('/change-password', protect, changePassword);
router.put('/two-factor', protect, toggleTwoFactor);
router.post('/logout-all', protect, logoutAllDevices);

// Protected routes - Preferences & Settings
router.put('/preferences', protect, updatePreferences);

// Protected routes - Danger Zone
router.post('/clear-progress', protect, clearProgress);
router.delete('/me', protect, deleteAccount);

// Admin only routes
router.get('/', protect, admin, getAllUsers);

module.exports = router;
