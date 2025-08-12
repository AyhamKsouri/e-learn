const API_URL = "http://localhost:5000/api/users";

// Helper function to get auth headers
const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
  };
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Types
export interface UserPreferences {
  language: 'en' | 'fr';
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  courseRecommendations: boolean;
}

export interface UserSession {
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  lastActive: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profileImage?: string;
  preferences: UserPreferences;
  twoFactorEnabled: boolean;
  enrolledCourses?: Array<{
    course: string;
    progress: number;
    enrolledAt: string;
  }>;
  completedCourses?: Array<{
    course: string;
    completedAt: string;
  }>;
  activeSessions?: UserSession[];
  createdAt: string;
  lastUpdated: string;
}

// API functions

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  return handleResponse(response);
};

/**
 * Update user profile (name and/or profile image)
 */
export const updateUserProfile = async (data: {
  name?: string;
  profileImage?: string | File;
}): Promise<{ message: string; user: User }> => {
  let body;
  let headers = getAuthHeaders(false);

  // Handle file upload vs text data
  if (data.profileImage instanceof File) {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    formData.append('profileImage', data.profileImage);
    body = formData;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers,
    body,
  });

  return handleResponse(response);
};

/**
 * Change user password
 */
export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (
  preferences: Partial<UserPreferences>
): Promise<{ message: string; preferences: UserPreferences }> => {
  const response = await fetch(`${API_URL}/preferences`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(preferences),
  });

  return handleResponse(response);
};

/**
 * Toggle two-factor authentication
 */
export const toggleTwoFactor = async (
  enabled: boolean
): Promise<{ message: string; twoFactorEnabled: boolean }> => {
  const response = await fetch(`${API_URL}/two-factor`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ enabled }),
  });

  return handleResponse(response);
};

/**
 * Logout from all other devices
 */
export const logoutAllDevices = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/logout-all`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

/**
 * Clear user progress
 */
export const clearUserProgress = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/clear-progress`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};
