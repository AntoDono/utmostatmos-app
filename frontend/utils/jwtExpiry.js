/**
 * Checks whether a JWT access token is expired (or within a 30-second buffer).
 * Works by base64-decoding the payload section — no extra dependencies needed.
 */
export const isAccessTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = token.split('.')[1];
    if (!payload) return true;
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return false; // no exp claim → assume valid
    // 30-second buffer so we don't hand a token that expires mid-request
    return Date.now() / 1000 >= decoded.exp - 30;
  } catch {
    return true; // unparseable → treat as expired
  }
};
