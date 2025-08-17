const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const teacherRoutes = require('./teacherRoutes');
const lessonRoutes = require('./lessonRoutes');
const { getPublishedCourses, getPublishedCourseById } = require('../controllers/courseController');

// Public routes
router.get('/courses', getPublishedCourses);
router.get('/courses/:id', getPublishedCourseById);

// Protected routes
router.use('/users', userRoutes);
router.use('/teachers', teacherRoutes);
router.use('/lessons', lessonRoutes);

module.exports = router;
