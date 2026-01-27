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

// Auth0 Configuration
// Replace these with your Auth0 tenant values
export const AUTH0_DOMAIN = getEnvVar('EXPO_PUBLIC_AUTH0_DOMAIN', 'YOUR_AUTH0_DOMAIN.auth0.com');
export const AUTH0_CLIENT_ID = getEnvVar('EXPO_PUBLIC_AUTH0_CLIENT_ID', 'YOUR_AUTH0_CLIENT_ID');
export const AUTH0_AUDIENCE = getEnvVar('EXPO_PUBLIC_AUTH0_AUDIENCE', 'https://api.utmostatmos.com');

