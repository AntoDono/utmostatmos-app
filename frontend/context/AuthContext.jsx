import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '../constants/config';

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
    user,
    isLoading,
    error,
    getCredentials,
  } = useAuth0();

  const [accessToken, setAccessToken] = useState(null);

  // Fetch credentials when user changes
  useEffect(() => {
    const fetchCredentials = async () => {
      if (user) {
        try {
          const credentials = await getCredentials();
          setAccessToken(credentials?.accessToken || null);
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
    try {
      await authorize();
      // Credentials will be fetched by the useEffect above
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  // Logout and clear session
  const logout = async () => {
    try {
      await clearSession();
      setAccessToken(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  // Get current access token (refreshes if needed)
  const getAccessToken = async () => {
    try {
      const credentials = await getCredentials();
      const token = credentials?.accessToken || null;
      setAccessToken(token);
      return token;
    } catch (err) {
      console.error('Error getting access token:', err);
      return null;
    }
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
