import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'sessionId';

export const storage = {
  // Store session ID (cookie-like behavior)
  async setSessionId(sessionId) {
    try {
      await AsyncStorage.setItem(SESSION_KEY, sessionId);
    } catch (error) {
      console.error('Error storing session:', error);
    }
  },

  // Get session ID
  async getSessionId() {
    try {
      return await AsyncStorage.getItem(SESSION_KEY);
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  // Remove session ID
  async removeSessionId() {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Error removing session:', error);
    }
  },
};

