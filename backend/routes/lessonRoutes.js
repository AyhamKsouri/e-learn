const express = require('express');
const router = express.Router();
const {
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
  reorderLessons,
  getLessonAnalytics,
  getCourseLessons
} = require('../controllers/lessonController');
const { protect, teacher } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Test route (remove in production)
router.get('/test', (req, res) => {
  res.json({ message: 'Lesson API is working!', timestamp: new Date().toISOString() });
});

// Teacher-only routes
router.post('/', teacher, createLesson);
router.put('/reorder', teacher, reorderLessons);
router.get('/course/:courseId', teacher, getCourseLessons);

// Routes accessible by both teachers and enrolled students
router.get('/:id', getLessonById);

// Teacher-only routes that come after the :id route
router.put('/:id', teacher, updateLesson);
router.delete('/:id', teacher, deleteLesson);
router.get('/:id/analytics', teacher, getLessonAnalytics);

module.exports = router;
