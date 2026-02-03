// Get environment variables
// Expo uses process.env.EXPO_PUBLIC_* for environment variables
const getEnvVar = (name) => {
  // Check process.env first (works in Expo)
  if (typeof process !== 'undefined' && process.env[name]) {
    return process.env[name];
  }
  throw new Error(`Missing required environment variable: ${name}`);
};

/**
 * Backend API base URL
 * Used for all API requests to the Node.js/Express backend server
 * Set via: EXPO_PUBLIC_API_URL environment variable
 */
export const API_URL = getEnvVar('EXPO_PUBLIC_API_URL');

/**
 * Frontend application URL
 * Used for web-specific configurations and redirects
 * Set via: EXPO_PUBLIC_FRONTEND_URL environment variable
 */
export const FRONTEND_URL = getEnvVar('EXPO_PUBLIC_FRONTEND_URL');

/**
 * Auth0 tenant domain
 * Your unique Auth0 tenant URL (e.g., 'your-tenant.us.auth0.com')
 * Used to connect to your Auth0 authentication service
 * Set via: EXPO_PUBLIC_AUTH0_DOMAIN environment variable
 */
export const AUTH0_DOMAIN = getEnvVar('EXPO_PUBLIC_AUTH0_DOMAIN');

/**
 * Auth0 application client ID
 * Unique identifier for your Auth0 application
 * Found in Auth0 Dashboard > Applications > Settings
 * Set via: EXPO_PUBLIC_AUTH0_CLIENT_ID environment variable
 */
export const AUTH0_CLIENT_ID = getEnvVar('EXPO_PUBLIC_AUTH0_CLIENT_ID');

/**
 * Auth0 API audience identifier
 * Specifies which API the access token is intended for
 * Used to request tokens with proper permissions
 * Set via: EXPO_PUBLIC_AUTH0_AUDIENCE environment variable
 */
export const AUTH0_AUDIENCE = getEnvVar('EXPO_PUBLIC_AUTH0_AUDIENCE');

/**
 * Application bundle identifier
 * Must match the bundleIdentifier in app.json for iOS and package for Android
 * Used to construct deep link URLs for Auth0 callbacks on native platforms
 * Format: Reverse domain notation (com.company.appname)
 */
export const APP_BUNDLE_ID = 'org.utmostatmos.utmostatmos';

/**
 * Application URL scheme
 * Must match the scheme in app.json
 * Used for deep linking back to the app from external sources
 * Note: Currently using bundle ID as the scheme for Auth0 callbacks
 */
export const APP_SCHEME = 'org.utmostatmos.app';

/**
 * Generates platform-specific Auth0 redirect URL
 * 
 * @param {string} platform - Platform OS ('ios', 'android', 'web', etc.)
 * @returns {string|undefined} Redirect URL for native platforms, undefined for web
 * 
 * Purpose: Creates the callback URL that Auth0 redirects to after authentication
 * 
 * - Web: Returns undefined (Auth0 uses standard HTTP redirects)
 * - iOS/Android: Returns deep link URL in format:
 *   {bundleId}://{auth0Domain}/{platform}/{bundleId}/callback
 * 
 * Example output for iOS:
 *   "org.utmostatmos.app://dev-kh7qflkc.us.auth0.com/ios/org.utmostatmos.app/callback"
 * 
 * Important: Add these URLs to Auth0 Dashboard > Settings > Allowed Callback URLs
 */
export const getAuth0RedirectUrl = (platform) => {
  if (platform === 'web') {
    return undefined; // Web uses default Auth0 behavior
  }
  
  // Format: {bundleId}://{auth0Domain}/{platform}/{bundleId}/callback
  return `${APP_BUNDLE_ID}://${AUTH0_DOMAIN}/${platform}/${APP_BUNDLE_ID}/callback`;
};

