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

// 2FA handshake response when user has 2FA enabled during login
export interface Login2FAResponse {
  message: string;
  requires2FA: true;
  userId: string;
  email: string; // masked email from backend
}

export type LoginResponse = AuthResponse | Login2FAResponse;

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

export const loginUser = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data as LoginResponse;
};

// Verify 2FA code to complete login
export const verifyTwoFactor = async (payload: { userId: string; code: string }): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/verify-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || '2FA verification failed');
  }
  return data as AuthResponse;
};

// Resend 2FA code
export const resendTwoFactor = async (userId: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/resend-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to resend 2FA code');
  }
  return data as { message: string };
};

// Get 2FA pending status (optional helper)
export const getTwoFactorStatus = async (userId: string): Promise<{
  hasPendingCode: boolean;
  timeRemaining?: number;
  attemptsUsed?: number;
  maxAttempts?: number;
  email?: string;
}> => {
  const res = await fetch(`${API_URL}/2fa-status/${userId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch 2FA status');
  }
  return data;
};
