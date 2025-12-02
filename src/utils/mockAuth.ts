export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'mentor';
}

let currentUser: User | null = null;

export const mockAuth = {
  login: (email: string, password: string, role?: 'student' | 'admin' | 'mentor'): User | null => {
    // Mock login - accept any email/password for demo
    if (email && password) {
      let userRole: 'student' | 'admin' | 'mentor' = 'student';
      if (role) {
        userRole = role;
      } else if (email.includes('admin')) {
        userRole = 'admin';
      } else if (email.includes('mentor')) {
        userRole = 'mentor';
      }
      
      currentUser = {
        id: 'user1',
        name: email.split('@')[0],
        email,
        role: userRole
      };
      localStorage.setItem('gapsense_user', JSON.stringify(currentUser));
      return currentUser;
    }
    return null;
  },

  signup: (name: string, email: string, password: string, role: 'student' | 'admin' | 'mentor' = 'student'): User | null => {
    // Mock signup
    if (name && email && password) {
      currentUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: role
      };
      localStorage.setItem('gapsense_user', JSON.stringify(currentUser));
      return currentUser;
    }
    return null;
  },

  logout: (): void => {
    currentUser = null;
    localStorage.removeItem('gapsense_user');
  },

  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem('gapsense_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return mockAuth.getCurrentUser() !== null;
  }
};

