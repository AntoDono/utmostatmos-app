export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const FRONTEND_URL = process.env.EXPO_PUBLIC_FRONTEND_URL;
export const AUTH0_DOMAIN = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
export const AUTH0_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;
export const AUTH0_AUDIENCE = process.env.EXPO_PUBLIC_AUTH0_AUDIENCE;

export const APP_BUNDLE_ID = 'org.utmostatmos.utmostatmos';
export const APP_SCHEME = 'org.utmostatmos.utmostatmos';

/**
 * Generates platform-specific Auth0 redirect URL
 * - Web: uses FRONTEND_URL + /callback
 * - iOS/Android: deep link in format {scheme}://{auth0Domain}/{platform}/{bundleId}/callback
 */
export const getAuth0RedirectUrl = (platform) => {
  if (platform === 'web') {
    return `${FRONTEND_URL}/callback`;
  }
  return `${APP_SCHEME}://${AUTH0_DOMAIN}/${platform}/${APP_BUNDLE_ID}/callback`;
};
