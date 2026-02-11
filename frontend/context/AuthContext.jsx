import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { Platform, DeviceEventEmitter } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE, FRONTEND_URL, getAuth0RedirectUrl } from '../constants/config';

// WebBrowser configuration for better UX
WebBrowser.maybeCompleteAuthSession();

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

// Web-specific auth implementation
const WebAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Function to check stored auth
  const checkStoredAuth = () => {
    try {
      const storedToken = localStorage.getItem('auth0_access_token');
      const storedUser = localStorage.getItem('auth0_user');
      const anonFlag = localStorage.getItem('isAnonymous');
      
      if (anonFlag === 'true') {
        setIsAnonymous(true);
        setUser(null);
        setAccessToken(null);
      } else if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAnonymous(false);
      } else {
        setUser(null);
        setAccessToken(null);
        setIsAnonymous(false);
      }
    } catch (err) {
      console.error('Error loading stored auth:', err);
    }
  };

  // Check for stored token on mount
  useEffect(() => {
    checkStoredAuth();
  }, []);

  // Listen for storage changes (when tokens are added/removed)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only react to auth-related storage changes
      if (e.key === 'auth0_access_token' || e.key === 'auth0_user' || e.key === 'isAnonymous') {
        console.log('Storage changed, reloading auth state');
        checkStoredAuth();
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also create a custom event listener for same-window changes
    const handleCustomAuthChange = () => {
      console.log('Auth changed, reloading auth state');
      checkStoredAuth();
    };
    window.addEventListener('auth-changed', handleCustomAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleCustomAuthChange);
    };
  }, []);

  const login = async () => {
    if (isLoggingIn || isLoggingOut) {
      console.log('Auth transaction already in progress');
      return;
    }

    try {
      setIsLoggingIn(true);
      setError(null);

      const redirectUri = `${FRONTEND_URL}/callback`;
      const state = Math.random().toString(36).substring(7);
      
      // Store state for verification
      sessionStorage.setItem('auth0_state', state);

      // Build Auth0 authorization URL
      const authUrl = `https://${AUTH0_DOMAIN}/authorize?` +
        `response_type=token id_token&` +
        `client_id=${AUTH0_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid profile email&` +
        `audience=${encodeURIComponent(AUTH0_AUDIENCE)}&` +
        `state=${state}&` +
        `nonce=${Math.random().toString(36).substring(7)}`;

      // Open Auth0 login in same window
      window.location.href = authUrl;
    } catch (err) {
      console.error('Login error:', err);
      setError(err);
      setIsLoggingIn(false);
      throw err;
    }
  };

  const logout = async () => {
    if (isLoggingOut || isLoggingIn) {
      console.log('Auth transaction already in progress');
      return;
    }

    try {
      setIsLoggingOut(true);
      
      // Clear local state
      setAccessToken(null);
      setUser(null);
      setIsAnonymous(false);
      localStorage.removeItem('auth0_access_token');
      localStorage.removeItem('auth0_user');
      localStorage.removeItem('isAnonymous');
      sessionStorage.removeItem('auth0_state');
      
      // Trigger custom event to notify about auth changes
      window.dispatchEvent(new Event('auth-changed'));
      
      console.log('Local logout completed (web)');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getAccessToken = async () => {
    if (!user) {
      throw new Error('User not logged in');
    }
    if (!accessToken) {
      throw new Error('No access token available');
    }
    return accessToken;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user || isAnonymous,
    isAnonymous,
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

// Native auth provider component (iOS/Android)
const NativeAuthProvider = ({ children }) => {
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
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Check for anonymous flag on mount and when auth state changes
  useEffect(() => {
    const checkAnonymous = async () => {
      try {
        const anonFlag = await AsyncStorage.getItem('isAnonymous');
        setIsAnonymous(anonFlag === 'true');
      } catch (err) {
        console.error('Error checking anonymous flag:', err);
      }
    };
    
    // Initial check
    checkAnonymous();
    
    // Listen for auth-changed events on mobile
    const subscription = DeviceEventEmitter.addListener('auth-changed', checkAnonymous);
    
    return () => {
      subscription.remove();
    };
  }, []);

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
      setIsAnonymous(false);
      await AsyncStorage.removeItem('isAnonymous');
      
      // Emit auth-changed event for mobile
      DeviceEventEmitter.emit('auth-changed');
      
      // Platform-specific logout behavior
      const platform = Platform.OS;
      
      // For iOS and Web, do local logout to avoid browser popup
      if (platform === 'ios' || platform === 'web') {
        // Clear local credentials (removes user and tokens from device)
        await clearCredentials();
        console.log(`Local logout completed (${platform})`);
        return;
      }
      
      // For Android, do full Auth0 logout with browser redirect
      const redirectUrl = getAuth0RedirectUrl(platform);

      // Try to clear Auth0 session
      await clearSession({
        ...(redirectUrl && { redirectUrl }), // Only include if defined
      });
      console.log('Auth0 session cleared (Android)');
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
    isAuthenticated: !!user || isAnonymous,
    isAnonymous,
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

// Main Auth provider that conditionally uses web or native auth
export const AuthProvider = ({ children }) => {
  // Use web-specific auth for web platform
  if (Platform.OS === 'web') {
    return <WebAuthProvider>{children}</WebAuthProvider>;
  }
  
  // Use react-native-auth0 for iOS/Android
  return (
    <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
      <NativeAuthProvider>
        {children}
      </NativeAuthProvider>
    </Auth0Provider>
  );
};

export default AuthContext;
