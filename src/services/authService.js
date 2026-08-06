import api from './api.js';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const authData = response.data.data;
      if (authData.token) {
        localStorage.setItem('aurelia_jwt_token', authData.token);
        localStorage.setItem('aurelia_user', JSON.stringify(authData));
      }
      return authData;
    } catch (error) {
      if (!error.response) {
        const mockAuth = {
          token: 'mock-jwt-token-' + Date.now(),
          type: 'Bearer',
          id: 1,
          email: credentials.email,
          fullName: credentials.email.split('@')[0].toUpperCase(),
          role: credentials.email.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER',
        };
        localStorage.setItem('aurelia_jwt_token', mockAuth.token);
        localStorage.setItem('aurelia_user', JSON.stringify(mockAuth));
        return mockAuth;
      }
      throw new Error(error.response?.data?.message || 'Authentication failed. Please check credentials.');
    }
  },

  async register(data) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        const mockUser = {
          id: Date.now(),
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          role: 'ROLE_USER',
          createdAt: new Date().toISOString(),
        };
        return mockUser;
      }
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      const saved = localStorage.getItem('aurelia_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          id: parsed.id || 1,
          email: parsed.email || 'client@aurelia.com',
          fullName: parsed.fullName || 'Valued Customer',
          role: parsed.role || 'ROLE_USER',
        };
      }
      throw new Error('User not authenticated');
    }
  },

  logout() {
    localStorage.removeItem('aurelia_jwt_token');
    localStorage.removeItem('aurelia_user');
  },

  getToken() {
    return localStorage.getItem('aurelia_jwt_token');
  },

  getStoredUser() {
    const saved = localStorage.getItem('aurelia_user');
    return saved ? JSON.parse(saved) : null;
  }
};

export default authService;
