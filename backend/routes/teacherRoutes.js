const express = require('express');
const router = express.Router();
const {
    registerTeacher,
    loginTeacher,
    getTeacherProfile,
    updateTeacherProfile,
} = require('../controllers/teacherController');
const {
    createCourse,
    getTeacherCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    toggleCoursePublication,
    getCourseStats,
} = require('../controllers/courseController');
const { protect, teacher } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// Public routes
router.post('/register', registerTeacher);
router.post('/login', loginTeacher);

// Protected teacher routes - Profile
router.get('/me', protect, teacher, getTeacherProfile);
router.put('/me', protect, teacher, upload.single('profileImage'), handleMulterError, updateTeacherProfile);

// Protected teacher routes - Courses
router.post('/courses', protect, teacher, createCourse);
router.get('/courses', protect, teacher, getTeacherCourses);
router.get('/courses/stats', protect, teacher, getCourseStats);
router.get('/courses/:id', protect, teacher, getCourseById);
router.put('/courses/:id', protect, teacher, updateCourse);
router.delete('/courses/:id', protect, teacher, deleteCourse);
router.patch('/courses/:id/publish', protect, teacher, toggleCoursePublication);

module.exports = router;
