interface AuthResponse {
  success: boolean;
  token?: string;
  userId?: string;
  fullName?: string;
  error?: string;
  message?: string;
}

interface UserRegisterData {
  fullName: string;
  email: string;
  password: string;
}

// API base URL - this should match your login server URL
const API_BASE_URL = 'http://localhost:5004/api/auth';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store authentication data in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', email);
        if (data.fullName) {
          localStorage.setItem('fullName', data.fullName);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error or server unavailable',
      };
    }
  },

  async register(fullName: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store authentication data in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', email);
        if (data.fullName) {
          localStorage.setItem('fullName', data.fullName);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error or server unavailable',
      };
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    return !!token && !!userId;
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userEmail');
  },

  // Get the authentication token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // Get the user ID
  getUserId(): string | null {
    return localStorage.getItem('userId');
  },

  // Get user's full name
  getFullName(): string | null {
    return localStorage.getItem('fullName');
  },

  // Get user's email
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  },

  // Check server status
  async checkServerStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      const data = await response.json();
      return data.mongoConnected;
    } catch (error) {
      console.error('Server status check error:', error);
      return false;
    }
  }
};
