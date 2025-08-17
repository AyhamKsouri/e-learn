const API_URL = "http://localhost:5000/api";

export interface Lesson {
  _id?: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface Course {
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

export interface CoursesResponse {
  courses: Course[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
  sortBy?: 'createdAt' | 'rating' | 'price' | 'enrolled';
  sortOrder?: 'asc' | 'desc';
}

// Public course API
export const coursesAPI = {
  // Get all published courses with filters
  getAll: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const queryParams = new URLSearchParams();

    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.level) queryParams.append('level', filters.level);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const url = `${API_URL}/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch courses');
    }

    return data;
  },

  // Get a single published course by ID
  getById: async (courseId: string): Promise<Course> => {
    const response = await fetch(`${API_URL}/courses/${courseId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch course');
    }

    return data;
  },
  updateCourse: async (courseId: string, courseData: Partial<Course>): Promise<Course> => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update course");
    }
    return data;
  },
  // Get course categories
  getCategories: (): string[] => {
    return ['programming', 'design', 'business', 'marketing', 'science', 'language', 'other'];
  },

  // Get course levels
  getLevels: (): string[] => {
    return ['beginner', 'intermediate', 'advanced'];
  }
};

