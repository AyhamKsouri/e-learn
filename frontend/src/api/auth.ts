const API_URL = "http://localhost:5000/api/users";

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  token: string;
  enrolledCourses?: Array<{
    course: string;
    progress: number;
  }>;
  completedCourses?: string[];
  createdAt: string;
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
