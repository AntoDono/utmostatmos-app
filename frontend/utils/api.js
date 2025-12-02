import { API_URL } from '../constants/config';
import { storage } from './storage';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const sessionId = await storage.getSessionId();
  const method = options.method || 'GET';
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    method,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Only add body for POST, PUT, DELETE requests
  if (method !== 'GET') {
    // Parse body if it's a string, otherwise use as is
    let body = options.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    } else if (!body) {
      body = {};
    }

    // Add sessionId to body if it exists
    if (sessionId) {
      body.sessionId = sessionId;
    }

    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  // Sign up
  async signup(email, password, firstName, lastName) {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  },

  // Login
  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Store sessionId if returned
    if (response.sessionId) {
      await storage.setSessionId(response.sessionId);
    }
    return response;
  },

  // Logout
  async logout() {
    const sessionId = await storage.getSessionId();
    if (!sessionId) {
      throw new Error('No session found');
    }
    const result = await apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
    await storage.removeSessionId();
    return result;
  },

  // Delete account
  async deleteAccount() {
    const sessionId = await storage.getSessionId();
    if (!sessionId) {
      throw new Error('No session found');
    }
    const result = await apiRequest('/auth/delete-account', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
    await storage.removeSessionId();
    return result;
  },
};

// Quiz API
export const quizAPI = {
  // Get quizzes
  async getQuizzes(limit = 10) {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest(`/quiz${query}`, {
      method: 'GET',
    });
  },
};

// Leaderboard API
export const leaderboardAPI = {
  // Get leaderboard
  async getLeaderboard() {
    return apiRequest('/leaderboard', {
      method: 'GET',
    });
  },
};

// Tracker API
export const trackerAPI = {
  // Get all trackers or filter by type
  async getTrackers(type = null) {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return apiRequest(`/tracker${query}`, {
      method: 'GET',
    });
  },

  // Get tracker by ID
  async getTracker(id) {
    return apiRequest(`/tracker/${id}`, {
      method: 'GET',
    });
  },

  // Create tracker
  async createTracker(type, name, longitude, latitude) {
    return apiRequest('/tracker', {
      method: 'POST',
      body: JSON.stringify({ type, name, longitude, latitude }),
    });
  },

  // Update tracker
  async updateTracker(id, updates) {
    return apiRequest(`/tracker/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete tracker
  async deleteTracker(id) {
    return apiRequest(`/tracker/${id}`, {
      method: 'DELETE',
    });
  },
};

