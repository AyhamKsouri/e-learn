# Course Integration - Backend to Frontend

This document describes the changes made to integrate real courses from the backend with the frontend, removing all mock data.

## Changes Made

### 1. Backend Changes

#### New Public Course Endpoints
- **GET `/api/courses`** - Get all published courses with filtering, sorting, and pagination
- **GET `/api/courses/:id`** - Get a single published course by ID

#### Enhanced Course Controller
- Added `getPublishedCourses()` function with advanced filtering:
  - Category filtering
  - Level filtering  
  - Search functionality (text search in title, description, tags)
  - Sorting by: creation date, rating, price, enrollment count
  - Pagination support
- Added `getPublishedCourseById()` function for individual course details

#### Updated Routes
- Added public course routes in `backend/routes/index.js`
- Routes are accessible without authentication

### 2. Frontend Changes

#### New API Service (`frontend/src/api/courses.ts`)
- `coursesAPI.getAll()` - Fetch courses with filters
- `coursesAPI.getById()` - Fetch single course
- `coursesAPI.getCategories()` - Get available categories
- `coursesAPI.getLevels()` - Get available levels

#### Updated Components
- **CourseCard**: Updated to use new Course type and display additional info
- **Courses Page**: 
  - Real-time API integration
  - Advanced filtering and search
  - Pagination support
  - Loading states and error handling
- **CourseDetail Page**: 
  - Real-time API integration
  - Enhanced course information display
  - Instructor details
  - Lesson structure with descriptions

#### Updated Pages
- **Index Page**: Featured courses now come from API (top-rated courses)
- **Courses Page**: Complete overhaul with real data and advanced features

#### Type Definitions
- New `Course` interface matching backend model
- New `Lesson` interface with proper structure
- Support for all course properties (tags, reviews, enrollment, etc.)

### 3. Removed Files
- `frontend/src/data/mockCourses.ts` - No longer needed

## Testing the Integration

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```

### 2. Test Backend Endpoints
```bash
# Test the new public course endpoints
curl http://localhost:5000/api/courses
curl http://localhost:5000/api/courses?category=programming&level=beginner
curl http://localhost:5000/api/courses?search=react&sortBy=rating&sortOrder=desc
```

### 3. Create Sample Data (Optional)
If you don't have any courses in your database, run the test script:
```bash
cd backend
node test-courses.js
```

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Test Frontend Features
- Visit `/courses` to see real courses with filtering
- Click on a course to see detailed view
- Test search functionality
- Test category and level filters
- Test sorting options
- Visit homepage to see featured courses

## API Response Structure

### Course Object
```typescript
{
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  category: string;
  level: string;
  price: number;
  duration: number;
  thumbnail?: string;
  tags: string[];
  lessons: Lesson[];
  enrolledStudents: Array<{
    student: string;
    enrolledAt: string;
    progress: number;
  }>;
  rating: {
    average: number;
    count: number;
  };
  reviews: Array<{
    student: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Lesson Object
```typescript
{
  _id?: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
}
```

## Filtering and Search

### Available Filters
- **Category**: programming, design, business, marketing, science, language, other
- **Level**: beginner, intermediate, advanced
- **Search**: Text search in title, description, and tags
- **Sort By**: createdAt, rating, price, enrolled
- **Sort Order**: asc, desc
- **Pagination**: page, limit

### Example API Calls
```typescript
// Get all programming courses for beginners
coursesAPI.getAll({
  category: 'programming',
  level: 'beginner',
  sortBy: 'rating',
  sortOrder: 'desc'
});

// Search for React courses
coursesAPI.getAll({
  search: 'react',
  limit: 10
});

// Get courses with pagination
coursesAPI.getAll({
  page: 2,
  limit: 12
});
```

## Error Handling

The frontend now includes comprehensive error handling:
- Loading states for better UX
- Error messages for failed API calls
- Fallback UI when no courses are found
- Graceful degradation for missing data

## Performance Features

- Pagination to handle large numbers of courses
- Efficient filtering and sorting on the backend
- Text search indexing for better performance
- Proper loading states to prevent UI blocking

## Next Steps

To complete the integration, consider adding:
1. Course enrollment functionality
2. User progress tracking
3. Course reviews and ratings
4. Payment integration
5. Video streaming for lessons
6. Course completion certificates

