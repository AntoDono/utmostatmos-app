import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import colors from '../constants/colors';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    // Only process callback on web
    if (Platform.OS !== 'web') {
      router.replace('/(tabs)/home');
      return;
    }

    const handleCallback = () => {
      try {
        // Check if window is available
        if (typeof window === 'undefined') {
          setStatus('Error: Not in browser environment');
          setTimeout(() => router.replace('/auth/signIn'), 2000);
          return;
        }

        // Extract tokens from URL hash (Auth0 implicit flow)
        const hash = window.location.hash.substring(1);
        
        if (!hash) {
          console.error('No hash in URL');
          setStatus('No authentication data received');
          setTimeout(() => router.replace('/auth/signIn'), 2000);
          return;
        }

        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');
        const state = params.get('state');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        // Check for errors
        if (error) {
          console.error('Auth0 error:', error, errorDescription);
          setStatus(`Error: ${errorDescription || error}`);
          setTimeout(() => router.replace('/auth/signIn'), 3000);
          return;
        }

        // Verify state matches (CSRF protection)
        const storedState = sessionStorage.getItem('auth0_state');
        if (state && storedState && state !== storedState) {
          console.error('State mismatch - possible CSRF attack');
          setStatus('Security error: Invalid state');
          setTimeout(() => router.replace('/auth/signIn'), 2000);
          return;
        }

        // Store tokens if present
        if (accessToken && idToken) {
          setStatus('Extracting user information...');
          
          try {
            // Decode ID token to get user info (simple JWT decode)
            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            
            const userInfo = JSON.parse(jsonPayload);
            
            // Store in localStorage
            localStorage.setItem('auth0_access_token', accessToken);
            localStorage.setItem('auth0_user', JSON.stringify({
              sub: userInfo.sub,
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
            }));

            // Clean up
            sessionStorage.removeItem('auth0_state');
            
            setStatus('Sign in successful! Redirecting...');
            
            // Small delay to show success message
            setTimeout(() => {
              router.replace('/(tabs)/home');
            }, 500);
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            setStatus('Error processing user information');
            setTimeout(() => router.replace('/auth/signIn'), 2000);
          }
        } else {
          console.error('No tokens received. AccessToken:', !!accessToken, 'IDToken:', !!idToken);
          setStatus('No authentication tokens received');
          setTimeout(() => router.replace('/auth/signIn'), 2000);
        }
      } catch (err) {
        console.error('Error processing callback:', err);
        setStatus('Unexpected error occurred');
        setTimeout(() => router.replace('/auth/signIn'), 2000);
      }
    };

    // Small delay to ensure router is ready
    const timer = setTimeout(handleCallback, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color={colors.primaryDark} />
      <Text style={{ marginTop: 20, color: colors.textSecondary, fontSize: 16 }}>
        {status}
      </Text>
    </View>
  );
}
