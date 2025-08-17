const Course = require('../models/Course');
const User = require('../models/User');

// Create a new course
const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            level,
            price,
            duration,
            thumbnail,
            tags,
            lessons
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !level || price === undefined || !duration) {
            return res.status(400).json({
                message: 'Title, description, category, level, price, and duration are required'
            });
        }

        // Create course with teacher as instructor
        const courseData = {
            title,
            description,
            instructor: req.user._id,
            category,
            level,
            price: Number(price),
            duration: Number(duration),
            thumbnail: thumbnail || '',
            tags: tags || [],
            lessons: lessons || [],
        };

        const course = await Course.create(courseData);
        await course.populate('instructor', 'name email profileImage');

        res.status(201).json({
            message: 'Course created successfully',
            course,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get teacher's own courses
const getTeacherCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        const query = { instructor: req.user._id };
        
        // Filter by publication status if provided
        if (status === 'published') {
            query.isPublished = true;
        } else if (status === 'draft') {
            query.isPublished = false;
        }

        const courses = await Course.find(query)
            .populate('instructor', 'name email profileImage')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Course.countDocuments(query);

        res.json({
            courses,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single course by ID (teacher's own course)
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            instructor: req.user._id
        }).populate('instructor', 'name email profileImage bio');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a course
const updateCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            level,
            price,
            duration,
            thumbnail,
            tags,
            lessons,
            isPublished
        } = req.body;

        const course = await Course.findOne({
            _id: req.params.id,
            instructor: req.user._id
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Update fields if provided
        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (category !== undefined) course.category = category;
        if (level !== undefined) course.level = level;
        if (price !== undefined) course.price = Number(price);
        if (duration !== undefined) course.duration = Number(duration);
        if (thumbnail !== undefined) course.thumbnail = thumbnail;
        if (tags !== undefined) course.tags = tags;
        if (lessons !== undefined) course.lessons = lessons;
        if (isPublished !== undefined) course.isPublished = isPublished;

        await course.save();
        await course.populate('instructor', 'name email profileImage bio');

        res.json({
            message: 'Course updated successfully',
            course,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            instructor: req.user._id
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if course has enrolled students
        if (course.enrolledStudents.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete course with enrolled students. Please contact support.'
            });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Publish/Unpublish a course
const toggleCoursePublication = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            instructor: req.user._id
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Validate course has required content before publishing
        if (!course.isPublished && course.lessons.length === 0) {
            return res.status(400).json({
                message: 'Cannot publish course without lessons'
            });
        }

        course.isPublished = !course.isPublished;
        await course.save();

        res.json({
            message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
            course: {
                _id: course._id,
                title: course.title,
                isPublished: course.isPublished,
                publishedAt: course.publishedAt,
            },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get course statistics for teacher dashboard
const getCourseStats = async (req, res) => {
    try {
        const teacherId = req.user._id;

        const stats = await Course.aggregate([
            { $match: { instructor: teacherId } },
            {
                $group: {
                    _id: null,
                    totalCourses: { $sum: 1 },
                    publishedCourses: {
                        $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
                    },
                    draftCourses: {
                        $sum: { $cond: [{ $eq: ['$isPublished', false] }, 1, 0] }
                    },
                    totalStudents: {
                        $sum: { $size: '$enrolledStudents' }
                    },
                    averageRating: { $avg: '$rating.average' },
                    totalRevenue: {
                        $sum: {
                            $multiply: ['$price', { $size: '$enrolledStudents' }]
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalCourses: 0,
            publishedCourses: 0,
            draftCourses: 0,
            totalStudents: 0,
            averageRating: 0,
            totalRevenue: 0
        };

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all published courses (public endpoint)
const getPublishedCourses = async (req, res) => {
    try {
        const { page = 1, limit = 12, category, level, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        const query = { isPublished: true };
        
        // Filter by category if provided
        if (category) {
            query.category = category;
        }
        
        // Filter by level if provided
        if (level) {
            query.level = level;
        }
        
        // Search in title, description, and tags
        if (search) {
            query.$text = { $search: search };
        }
        
        // Sort options
        let sortOptions = {};
        if (sortBy === 'rating') {
            sortOptions = { 'rating.average': sortOrder === 'desc' ? -1 : 1 };
        } else if (sortBy === 'price') {
            sortOptions = { price: sortOrder === 'desc' ? -1 : 1 };
        } else if (sortBy === 'enrolled') {
            sortOptions = { 'enrolledStudents': sortOrder === 'desc' ? -1 : 1 };
        } else {
            sortOptions = { createdAt: sortOrder === 'desc' ? -1 : 1 };
        }

        const courses = await Course.find(query)
            .populate('instructor', 'name email profileImage')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Course.countDocuments(query);

        res.json({
            courses,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single published course by ID (public endpoint)
const getPublishedCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            isPublished: true
        }).populate('instructor', 'name email profileImage bio');

        if (!course) {
            return res.status(404).json({ message: 'Course not found or not published' });
        }

        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createCourse,
    getTeacherCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    toggleCoursePublication,
    getCourseStats,
    getPublishedCourses,
    getPublishedCourseById,
};
