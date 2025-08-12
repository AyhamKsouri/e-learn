const API_URL = "http://localhost:5000/api/users";

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UserPreferences {
  language: 'en' | 'fr' ;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  courseRecommendations: boolean;
}

interface UserSession {
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  lastActive: string;
  createdAt: string;
}

interface AuthResponse {
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
  token: string;
  message?: string;
}

export const registerUser = async (userData: UserData): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  
  return data;
};

export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data;
};
