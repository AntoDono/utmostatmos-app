import { API_URL } from '../constants/config';

// Helper function to make API requests
// Pass accessToken for authenticated requests
const apiRequest = async (endpoint, options = {}, accessToken = null) => {
  const method = options.method || 'GET';
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if access token is provided
  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    method,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Only add body for POST, PUT, DELETE requests
  if (method !== 'GET' && options.body) {
    config.body = typeof options.body === 'string' 
      ? options.body 
      : JSON.stringify(options.body);
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

// Auth API - now uses Auth0 tokens
export const authAPI = {
  // Get current user profile (requires auth)
  async getProfile(accessToken) {
    return apiRequest('/auth/profile', { method: 'GET' }, accessToken);
  },

  // Update user profile (requires auth)
  async updateProfile(accessToken, { firstName, lastName }) {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: { firstName, lastName },
    }, accessToken);
  },

  // Delete user account (requires auth)
  async deleteAccount(accessToken) {
    return apiRequest('/auth/account', {
      method: 'DELETE',
    }, accessToken);
  },
};

// Quiz API
export const quizAPI = {
  // Get quizzes (public endpoint)
  async getQuizzes(limit = 10) {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest(`/quiz${query}`, {
      method: 'GET',
    });
  },

  // Submit quiz answer (requires auth)
  async submitAnswer(accessToken, points) {
    return apiRequest('/quiz/submit', {
      method: 'POST',
      body: { points },
    }, accessToken);
  },
};

// Leaderboard API
export const leaderboardAPI = {
  // Get leaderboard (public endpoint)
  async getLeaderboard() {
    return apiRequest('/leaderboard', {
      method: 'GET',
    });
  },
};

// Tracker API
export const trackerAPI = {
  // Get all trackers or filter by type (public endpoint)
  async getTrackers(type = null) {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return apiRequest(`/tracker${query}`, {
      method: 'GET',
    });
  },

  // Get tracker by ID (public endpoint)
  async getTracker(id) {
    return apiRequest(`/tracker/${id}`, {
      method: 'GET',
    });
  },

  // Create tracker (could require auth in future)
  async createTracker(type, name, longitude, latitude, accessToken = null) {
    return apiRequest('/tracker', {
      method: 'POST',
      body: { type, name, longitude, latitude },
    }, accessToken);
  },

  // Update tracker (could require auth in future)
  async updateTracker(id, updates, accessToken = null) {
    return apiRequest(`/tracker/${id}`, {
      method: 'PUT',
      body: updates,
    }, accessToken);
  },

  // Delete tracker (could require auth in future)
  async deleteTracker(id, accessToken = null) {
    return apiRequest(`/tracker/${id}`, {
      method: 'DELETE',
    }, accessToken);
  },
};

// Helper to create an authenticated API client
// Usage: const api = createAuthenticatedAPI(getAccessToken);
//        await api.authAPI.getProfile();
export const createAuthenticatedAPI = (getAccessTokenFn) => {
  return {
    authAPI: {
      async getProfile() {
        const token = await getAccessTokenFn();
        return authAPI.getProfile(token);
      },
      async updateProfile(data) {
        const token = await getAccessTokenFn();
        return authAPI.updateProfile(token, data);
      },
      async deleteAccount() {
        const token = await getAccessTokenFn();
        return authAPI.deleteAccount(token);
      },
    },
    trackerAPI: {
      ...trackerAPI,
      async createTracker(type, name, longitude, latitude) {
        const token = await getAccessTokenFn();
        return trackerAPI.createTracker(type, name, longitude, latitude, token);
      },
      async updateTracker(id, updates) {
        const token = await getAccessTokenFn();
        return trackerAPI.updateTracker(id, updates, token);
      },
      async deleteTracker(id) {
        const token = await getAccessTokenFn();
        return trackerAPI.deleteTracker(id, token);
      },
    },
    quizAPI: {
      ...quizAPI,
      async submitAnswer(points) {
        const token = await getAccessTokenFn();
        return quizAPI.submitAnswer(token, points);
      },
    },
    leaderboardAPI,
  };
};
