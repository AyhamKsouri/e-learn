const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Create a new lesson
// @route   POST /api/lessons
// @access  Private (Teacher only)
const createLesson = asyncHandler(async (req, res) => {
  const { courseId, title, description, content, duration, order } = req.body;
  const teacherId = req.user._id;

  // Verify teacher owns the course
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== teacherId.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this course');
  }

  const lesson = await Lesson.create({
    courseId,
    title,
    description,
    content,
    duration,
    order: order || 0,
    createdBy: teacherId
  });

  // Update course lessons array
  await Course.findByIdAndUpdate(courseId, {
    $push: { lessons: lesson._id }
  });

  res.status(201).json({
    success: true,
    data: lesson
  });
});

// @desc    Get lesson by ID
// @route   GET /api/lessons/:id
// @access  Private (Teacher or enrolled student)
const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id)
    .populate('courseId', 'title instructor isPublished')
    .populate('createdBy', 'name');

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  res.json({
    success: true,
    data: lesson
  });
});

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Teacher only)
const updateLesson = asyncHandler(async (req, res) => {
  const { title, description, content, duration, order } = req.body;
  const teacherId = req.user._id;

  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  // Verify teacher owns the course
  const course = await Course.findById(lesson.courseId);
  if (course.instructor.toString() !== teacherId.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this lesson');
  }

  const updatedLesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      content,
      duration,
      order,
      updatedAt: Date.now()
    },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedLesson
  });
});

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Teacher only)
const deleteLesson = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  // Verify teacher owns the course
  const course = await Course.findById(lesson.courseId);
  if (course.instructor.toString() !== teacherId.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this lesson');
  }

  // Remove lesson from course
  await Course.findByIdAndUpdate(lesson.courseId, {
    $pull: { lessons: lesson._id }
  });

  await Lesson.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Lesson deleted successfully'
  });
});

// @desc    Reorder lessons
// @route   PUT /api/lessons/reorder
// @access  Private (Teacher only)
const reorderLessons = asyncHandler(async (req, res) => {
  const { courseId, lessonOrders } = req.body;
  const teacherId = req.user._id;

  // Verify teacher owns the course
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== teacherId.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this course');
  }

  // Update lesson orders
  const updatePromises = lessonOrders.map(({ lessonId, order }) =>
    Lesson.findByIdAndUpdate(lessonId, { order })
  );

  await Promise.all(updatePromises);

  res.json({
    success: true,
    message: 'Lessons reordered successfully'
  });
});

// @desc    Get lesson analytics
// @route   GET /api/lessons/:id/analytics
// @access  Private (Teacher only)
const getLessonAnalytics = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;
  const lessonId = req.params.id;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  // Verify teacher owns the course
  const course = await Course.findById(lesson.courseId);
  if (course.instructor.toString() !== teacherId.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this lesson analytics');
  }

  // Get course enrollment data
  const enrolledStudents = course.enrolledStudents || [];
  const totalEnrolled = enrolledStudents.length;

  // Calculate analytics (this would be enhanced with actual progress tracking)
  const analytics = {
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    totalEnrolled,
    completedCount: Math.floor(totalEnrolled * 0.7), // Mock data - replace with real tracking
    inProgressCount: Math.floor(totalEnrolled * 0.2), // Mock data
    notStartedCount: Math.floor(totalEnrolled * 0.1), // Mock data
    averageCompletionTime: 45, // Mock data - minutes
    engagementRate: 85, // Mock data - percentage
    lastAccessed: new Date().toISOString(),
    createdAt: lesson.createdAt,
    updatedAt: lesson.updatedAt
  };

  res.json({
    success: true,
    data: analytics
  });
});

// @desc    Get course lessons with analytics
// @route   GET /api/courses/:courseId/lessons
// @access  Private (Teacher only)
const getCourseLessons = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;
  const courseId = req.params.courseId;

  // Verify teacher owns the course
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== teacherId.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this course lessons');
  }

  // Get lessons with full data
  const lessons = await Lesson.find({ courseId })
    .sort({ order: 1 })
    .select('title description duration order createdAt updatedAt isPublished');

  // Add basic analytics for each lesson
  const lessonsWithAnalytics = lessons.map(lesson => ({
    ...lesson.toObject(),
    analytics: {
      totalEnrolled: course.enrolledStudents?.length || 0,
      completedCount: Math.floor((course.enrolledStudents?.length || 0) * 0.7), // Mock data
      engagementRate: Math.floor(Math.random() * 30) + 70 // Mock data 70-100%
    }
  }));

  res.json({
    success: true,
    data: lessonsWithAnalytics
  });
});

module.exports = {
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
  reorderLessons,
  getLessonAnalytics,
  getCourseLessons
};
