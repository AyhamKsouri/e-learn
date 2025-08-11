const API_URL = "http://localhost:5000/api/users";

interface UserData {
  name?: string;
  email: string;
  password: string;
  role?: string;
}

interface AuthResponse {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  token?: string;
  message?: string;
}

export const registerUser = async (userData: UserData): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return await res.json();
};

export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return await res.json();
};
