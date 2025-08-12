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
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

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
