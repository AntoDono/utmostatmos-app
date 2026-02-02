import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { Platform } from 'react-native';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, getAuth0RedirectUrl } from '../constants/config';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component that wraps the app
const AuthProviderInner = ({ children }) => {
  const {
    authorize,
    clearSession,
    clearCredentials,
    user,
    isLoading,
    error,
    getCredentials,
  } = useAuth0();

  const [accessToken, setAccessToken] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Fetch credentials when user changes
  useEffect(() => {
    const fetchCredentials = async () => {
      if (user) {
        try {
          const credentials = await getCredentials();
          const token = credentials?.accessToken || null;
          if (token && typeof token === 'string' && token.trim().length > 0) {
            setAccessToken(token);
          } else {
            setAccessToken(null);
          }
        } catch (err) {
          console.error('Error fetching credentials:', err);
          setAccessToken(null);
        }
      } else {
        setAccessToken(null);
      }
    };
    fetchCredentials();
  }, [user, getCredentials]);

  // Login with Auth0 Universal Login
  const login = async () => {
    // Prevent concurrent login attempts
    if (isLoggingIn || isLoggingOut) {
      console.log('Auth transaction already in progress');
      return;
    }

    try {
      setIsLoggingIn(true);
      
      // Get platform-specific redirect URL
      const platform = Platform.OS;
      const redirectUrl = getAuth0RedirectUrl(platform);

      await authorize({
        scope: 'openid profile email',
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        ...(redirectUrl && { redirectUrl }), // Only include if defined
      });
      // Credentials will be fetched by the useEffect above
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout and clear session
  const logout = async () => {
    // Prevent concurrent logout attempts
    if (isLoggingOut || isLoggingIn) {
      console.log('Auth transaction already in progress');
      return;
    }

    try {
      setIsLoggingOut(true);
      
      // Clear local token first
      setAccessToken(null);
      
      // For iOS, do local logout to avoid the browser popup
      if (Platform.OS === 'ios') {
        // Clear local credentials (removes user and tokens from device)
        await clearCredentials();
        console.log('Local logout completed (iOS)');
        return;
      }
      
      // For Android/Web, do full Auth0 logout
      const platform = Platform.OS;
      const redirectUrl = getAuth0RedirectUrl(platform);

      // Try to clear Auth0 session
      await clearSession({
        ...(redirectUrl && { redirectUrl }), // Only include if defined
      });
    } catch (err) {
      // User may have cancelled the logout - that's okay
      // Local session is already cleared above
      if (err.error === 'a0.session.user_cancelled') {
        console.log('User cancelled logout - local session cleared');
        return; // Don't throw error
      }
      
      // Handle transaction already active error
      if (err.message && err.message.includes('TRANSACTION_ACTIVE_ALREADY')) {
        console.log('Logout transaction already in progress - local session cleared');
        return; // Don't throw error
      }
      
      console.error('Logout error:', err);
      // Still don't throw - local state is cleared
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get current access token (refreshes if needed)
  const getAccessToken = async () => {
    if (!user) {
      throw new Error('User not logged in');
    }
    const credentials = await getCredentials();
    const token = credentials?.accessToken;
    
    if (token && typeof token === 'string' && token.trim().length > 0) {
      setAccessToken(token);
      return token;
    }
    
    throw new Error('Invalid or malformed access token received');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    accessToken,
    login,
    logout,
    getAccessToken,
    isLoggingOut,
    isLoggingIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Main Auth provider that includes Auth0Provider
export const AuthProvider = ({ children }) => {
  return (
    <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </Auth0Provider>
  );
};

export default AuthContext;
