// Get environment variables
// Expo uses process.env.EXPO_PUBLIC_* for environment variables
const getEnvVar = (name, defaultValue) => {
  // Check process.env first (works in Expo)
  if (typeof process !== 'undefined' && process.env[name]) {
    return process.env[name];
  }
  return defaultValue;
};

export const API_URL = getEnvVar('EXPO_PUBLIC_API_URL', 'http://localhost:3000');
export const FRONTEND_URL = getEnvVar('EXPO_PUBLIC_FRONTEND_URL', 'http://localhost:8081');

