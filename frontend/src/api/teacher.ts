const API_URL = "http://localhost:5000/api/teachers";

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// Teacher Authentication
export const teacherAuth = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    bio?: string;
  }) => {
    return makeAuthenticatedRequest(`${API_URL}/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return makeAuthenticatedRequest(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return makeAuthenticatedRequest(`${API_URL}/me`);
  },

  updateProfile: async (profileData: {
    name?: string;
    bio?: string;
    profileImage?: string;
  }) => {
    return makeAuthenticatedRequest(`${API_URL}/me`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Course Management
export const courseAPI = {
  create: async (courseData: {
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    duration: number;
    thumbnail?: string;
    tags?: string[];
    lessons?: any[];
  }) => {
    return makeAuthenticatedRequest(`${API_URL}/courses`, {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  getTeacherCourses: async (params?: {
    page?: number;
    limit?: number;
    status?: 'published' | 'draft';
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const url = `${API_URL}/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeAuthenticatedRequest(url);
  },

  getCourseById: async (courseId: string) => {
    return makeAuthenticatedRequest(`${API_URL}/courses/${courseId}`);
  },

  update: async (courseId: string, courseData: any) => {
    return makeAuthenticatedRequest(`${API_URL}/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  delete: async (courseId: string) => {
    return makeAuthenticatedRequest(`${API_URL}/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  togglePublication: async (courseId: string) => {
    return makeAuthenticatedRequest(`${API_URL}/courses/${courseId}/publish`, {
      method: 'PATCH',
    });
  },

  getStats: async () => {
    return makeAuthenticatedRequest(`${API_URL}/courses/stats`);
  },
};
