const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private + Admin only
router.get('/', protect, admin, getAllUsers);

module.exports = router;
