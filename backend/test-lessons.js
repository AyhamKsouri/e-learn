const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Course = require('./models/Course');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eduflex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testLessons = async () => {
  try {
    console.log('🔌 Connected to MongoDB');
    
    // Check if we have any courses
    const courses = await Course.find().limit(1);
    if (courses.length === 0) {
      console.log('❌ No courses found. Please create a course first.');
      return;
    }
    
    const course = courses[0];
    console.log(`📚 Found course: ${course.title}`);
    
    // Check if we have any lessons
    const lessons = await Lesson.find({ courseId: course._id });
    console.log(`📖 Found ${lessons.length} lessons for this course`);
    
    if (lessons.length === 0) {
      console.log('📝 Creating a test lesson...');
      
      // Create a test lesson
      const testLesson = new Lesson({
        courseId: course._id,
        title: 'Introduction to the Course',
        description: 'Welcome to this amazing course!',
        content: 'This is the first lesson content. Welcome aboard!',
        duration: 15,
        order: 0,
        createdBy: course.instructor,
        isPublished: true
      });
      
      await testLesson.save();
      console.log('✅ Test lesson created successfully!');
      
      // Update course to include the lesson
      await Course.findByIdAndUpdate(course._id, {
        $push: { lessons: testLesson._id }
      });
      console.log('✅ Course updated with new lesson');
    }
    
    // Test the lessons API endpoint
    console.log('\n🧪 Testing lessons API...');
    console.log(`GET /api/lessons/course/${course._id}`);
    console.log(`POST /api/lessons (with courseId: ${course._id})`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

testLessons();
