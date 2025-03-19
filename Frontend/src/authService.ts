interface User {
  email: string;
  password: string;
  userId: string;
}

// Test users
const testUsers: User[] = [
  { email: "test@example.com", password: "password123", userId: "user1" },
  { email: "admin@example.com", password: "admin123", userId: "user2" },
  { email: "demo@example.com", password: "demo123", userId: "user3" },
];

export const authService = {
  login: (email: string, password: string) => {
    const user = testUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: "Account does not exist or invalid credentials",
      };
    }

    return {
      success: true,
      token: `fake-jwt-token-${user.userId}`,
      userId: user.userId,
    };
  },

  register: (email: string, password: string) => {
    // Check if user already exists
    const existingUser = testUsers.find((u) => u.email === email);

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Create new user with random userId
    const userId = `user${Date.now()}`;
    const newUser = { email, password, userId };
    testUsers.push(newUser);

    return {
      success: true,
      token: `fake-jwt-token-${userId}`,
      userId,
    };
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    return !!token && !!userId;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  },
};
