import AsyncStorage from '@react-native-async-storage/async-storage';

// Generic storage utility for app data
// Auth0 SDK handles token storage automatically

export const storage = {
  // Store a value
  async set(key, value) {
    try {
      const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },

  // Get a value
  async get(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      
      // Try to parse as JSON, fall back to string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  },

  // Remove a value
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },

  // Clear all storage
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
