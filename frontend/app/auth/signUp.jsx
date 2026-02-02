import { Text, View, Image, TouchableOpacity, Pressable, ActivityIndicator, ScrollView } from "react-native"
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { Alert } from '../../components/Alert'
import { authStyles } from '../../constants/authStyles'
import colors from '../../constants/colors'

export default function SignUp() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading, error } = useAuth();

    // Redirect to home if already authenticated
    useEffect(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      }
    }, [isAuthenticated]);

    // Show error if signup failed
    useEffect(() => {
      if (error) {
        Alert.alert('Error', error.message || 'Authentication failed');
      }
    }, [error]);

    const handleSignUp = async () => {
      try {
        // Auth0 Universal Login handles both signup and login
        // The user can click "Sign up" on the Auth0 page
        await login();
        // Navigation will happen automatically via useEffect when isAuthenticated changes
      } catch (err) {
        Alert.alert('Error', err.message || 'Failed to sign up');
      }
    };

  return (
    <ScrollView 
      contentContainerStyle={authStyles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={authStyles.container}>
        
        <View style={authStyles.logoContainer}>
          <Image 
            source={require('./../../assets/images/Final-Logo.png')}
            style={authStyles.logo}
            resizeMode="contain"
          /> 
        </View> 
        
        <View style={authStyles.headerContainer}>
          <Text style={authStyles.title}>Create Account</Text>
        </View>

        <View style={authStyles.formContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primaryDark} style={{ marginVertical: 20 }} />
          ) : (
            <>
              <Text style={{ textAlign: 'center', marginBottom: 20, color: colors.textSecondary }}>
                Click below to create your account using Auth0's secure sign-up.
              </Text>

              <TouchableOpacity 
                style={authStyles.button}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={authStyles.buttonText}>Sign Up with Auth0</Text>
              </TouchableOpacity>

              <View style={authStyles.linkContainer}>
                <Pressable
                  onPress={() => router.push('/auth/signIn')}
                >
                  <Text style={authStyles.linkText}>
                    Already have an account? <Text style={authStyles.linkTextBold}>Login</Text>
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
