const API_URL = "http://localhost:5000/api/lessons";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  console.log('API: Handling response...');
  
  try {
    const data = await response.json();
    console.log('API: Response data:', data);
    
    if (!response.ok) {
      console.error('API: Error response:', data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API: Error parsing response:', error);
    throw new Error(`Failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Types
export interface LessonResource {
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'video' | 'link' | 'other';
}

export interface Lesson {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  media?: string;
  resources: LessonResource[];
  createdBy: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  formattedDuration?: string;
}

export interface LessonAnalytics {
  lessonId: string;
  lessonTitle: string;
  totalEnrolled: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  averageCompletionTime: number;
  engagementRate: number;
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonWithAnalytics extends Lesson {
  analytics: {
    totalEnrolled: number;
    completedCount: number;
    engagementRate: number;
  };
}

export interface CreateLessonData {
  courseId: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  order?: number;
  media?: string;
  resources?: LessonResource[];
}

export interface UpdateLessonData {
  title?: string;
  description?: string;
  content?: string;
  duration?: number;
  order?: number;
  media?: string;
  resources?: LessonResource[];
}

export interface ReorderLessonsData {
  courseId: string;
  lessonOrders: Array<{
    lessonId: string;
    order: number;
  }>;
}

// API functions
export const lessonsAPI = {
  /**
   * Create a new lesson
   */
  create: async (lessonData: CreateLessonData): Promise<{ success: boolean; data: Lesson }> => {
    console.log('API: Creating lesson with data:', lessonData);
    console.log('API: Using URL:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(lessonData),
    });
    
    console.log('API: Response status:', response.status);
    console.log('API: Response headers:', response.headers);
    
    return handleResponse(response);
  },

  /**
   * Get lesson by ID
   */
  getById: async (lessonId: string): Promise<{ success: boolean; data: Lesson }> => {
    const response = await fetch(`${API_URL}/${lessonId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  /**
   * Update lesson
   */
  update: async (lessonId: string, updates: UpdateLessonData): Promise<{ success: boolean; data: Lesson }> => {
    const response = await fetch(`${API_URL}/${lessonId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    
    return handleResponse(response);
  },

  /**
   * Delete lesson
   */
  delete: async (lessonId: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_URL}/${lessonId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  /**
   * Reorder lessons
   */
  reorder: async (reorderData: ReorderLessonsData): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_URL}/reorder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reorderData),
    });
    
    return handleResponse(response);
  },

  /**
   * Get lesson analytics
   */
  getAnalytics: async (lessonId: string): Promise<{ success: boolean; data: LessonAnalytics }> => {
    const response = await fetch(`${API_URL}/${lessonId}/analytics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  /**
   * Get course lessons with analytics
   */
  getCourseLessons: async (courseId: string): Promise<{ success: boolean; data: LessonWithAnalytics[] }> => {
    const response = await fetch(`${API_URL}/course/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  }
};
