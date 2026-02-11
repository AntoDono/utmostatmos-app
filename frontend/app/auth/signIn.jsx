import { Text, View, Image, TouchableOpacity, Pressable, ActivityIndicator } from "react-native"
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { Alert } from '../../components/Alert'
import { authStyles } from '../../constants/authStyles'
import colors from '../../constants/colors'

export default function SignIn() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading, error } = useAuth();

    // Redirect to home if already authenticated
    useEffect(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      }
    }, [isAuthenticated]);

    // Show error if login failed
    useEffect(() => {
      if (error) {
        Alert.alert('Error', error.message);
      }
    }, [error]);
    
    const handleLogin = async () => {
      try {
        await login();
        // Navigation will happen automatically via useEffect when isAuthenticated changes
      } catch (err) {
        Alert.alert('Error', err.message);
        throw err;
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
              style={authStyles.button}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={authStyles.buttonText}>Login</Text>
            </TouchableOpacity>

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
