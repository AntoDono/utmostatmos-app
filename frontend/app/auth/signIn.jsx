import { Text, View, Image, TouchableOpacity, Pressable, ActivityIndicator, Platform } from "react-native"
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { Alert } from '../../components/Alert'
import { authStyles } from '../../constants/authStyles'
import colors from '../../constants/colors'

export default function SignIn() {
    const router = useRouter();
    const { loginWithGoogle, loginWithApple, isAuthenticated, isLoading, error } = useAuth();

    useEffect(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      }
    }, [isAuthenticated]);

    useEffect(() => {
      if (error) {
        Alert.alert('Error', error.message);
      }
    }, [error]);
    
    const handleGoogleLogin = async () => {
      try {
        await loginWithGoogle();
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    };

    const handleAppleLogin = async () => {
      try {
        await loginWithApple();
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    };
    
  return (
    <View style={authStyles.container}>

      <View style={authStyles.logoContainer}>
        <Image 
          source={require('./../../assets/images/Final-Logo.png')}
          style={authStyles.logo}
          resizeMode="contain"
        /> 
      </View> 
      
      <View style={authStyles.headerContainer}>
        <Text style={authStyles.title}>Welcome Back!</Text>
      </View>

      <View style={authStyles.formContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primaryDark} style={{ marginVertical: 20 }} />
        ) : (
          <>
            <TouchableOpacity
              style={[authStyles.socialButton, authStyles.googleButton]}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <Text style={authStyles.googleButtonText}>G  Login with Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[authStyles.socialButton, authStyles.appleButton]}
                onPress={handleAppleLogin}
                disabled={isLoading}
              >
                <Text style={authStyles.appleIcon}>{'\uf8ff'}</Text>
                <Text style={authStyles.appleButtonText}>Sign in with Apple</Text>
              </TouchableOpacity>
            )}

            <View style={authStyles.linkContainer}>
              <Pressable 
                onPress={() => router.push('/auth/signUp')}
              >
                <Text style={authStyles.linkText}>
                  Don't have an account? <Text style={authStyles.linkTextBold}>Register</Text>
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>

      <View style={authStyles.footerContainer} />
    </View>
  );
}
