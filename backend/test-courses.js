const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

// Test database connection and create sample data
async function testCourses() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-learning-app');
    console.log('Connected to database');

    // Check if we have any users (teachers)
    const teachers = await User.find({ role: 'teacher' });
    console.log(`Found ${teachers.length} teachers`);

    if (teachers.length === 0) {
      console.log('No teachers found. Please create a teacher account first.');
      return;
    }

    // Check if we have any courses
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses`);

    if (courses.length === 0) {
      console.log('No courses found. Creating sample courses...');
      
      // Create sample courses
      const sampleCourses = [
        {
          title: "React Fundamentals",
          description: "Learn the basics of React including components, state, and props",
          instructor: teachers[0]._id,
          category: "programming",
          level: "beginner",
          price: 49.99,
          duration: 8,
          thumbnail: "",
          tags: ["react", "javascript", "frontend"],
          lessons: [
            {
              title: "Introduction to React",
              description: "What is React and why use it?",
              videoUrl: "",
              duration: 15,
              order: 1
            },
            {
              title: "Components and JSX",
              description: "Building your first React component",
              videoUrl: "",
              duration: 20,
              order: 2
            },
            {
              title: "State and Props",
              description: "Managing component data",
              videoUrl: "",
              duration: 25,
              order: 3
            }
          ],
          isPublished: true,
          publishedAt: new Date()
        },
        {
          title: "Advanced TypeScript",
          description: "Master TypeScript with advanced types and patterns",
          instructor: teachers[0]._id,
          category: "programming",
          level: "advanced",
          price: 79.99,
          duration: 12,
          thumbnail: "",
          tags: ["typescript", "javascript", "advanced"],
          lessons: [
            {
              title: "Advanced Types",
              description: "Complex type definitions and unions",
              videoUrl: "",
              duration: 30,
              order: 1
            },
            {
              title: "Generic Types",
              description: "Creating reusable type-safe code",
              videoUrl: "",
              duration: 35,
              order: 2
            }
          ],
          isPublished: true,
          publishedAt: new Date()
        }
      ];

      const createdCourses = await Course.create(sampleCourses);
      console.log(`Created ${createdCourses.length} sample courses`);
    }

    // Test the public endpoints
    console.log('\nTesting public course endpoints...');
    
    // Test getting all published courses
    const publishedCourses = await Course.find({ isPublished: true })
      .populate('instructor', 'name email profileImage');
    console.log(`Found ${publishedCourses.length} published courses`);
    
    publishedCourses.forEach(course => {
      console.log(`- ${course.title} by ${course.instructor.name} ($${course.price})`);
    });

    console.log('\n✅ Course endpoints are working correctly!');
    
  } catch (error) {
    console.error('Error testing courses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the test
testCourses();

