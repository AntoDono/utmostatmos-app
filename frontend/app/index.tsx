import { Image, Text, View, StyleSheet, TouchableOpacity, Platform } from "react-native"
import React, { useEffect } from 'react'
import colors from './../constants/colors'
import { useRouter } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../context/AuthContext'

export default function Index() {
  const router = useRouter()
  const { loginWithGoogle, loginWithApple, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/home')
    }
  }, [isAuthenticated])
  
  const handleAnonymousLogin = async () => {
    try {
      await AsyncStorage.setItem('isAnonymous', 'true')
      
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'))
      }
      
      router.replace('/(tabs)/home')
    } catch (error) {
      console.error('Error setting anonymous mode:', error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      console.error('Google login error:', err)
    }
  }

  const handleAppleLogin = async () => {
    try {
      await loginWithApple()
    } catch (err) {
      console.error('Apple login error:', err)
    }
  }
  
  return (
    <View style={styles.mainContainer}>

      <View style={styles.container} > 
        <Image 
          source={require('./../assets/images/Final-Logo.png')}
          style={styles.image}
          resizeMode="contain"
        /> 
      </View> 

      <TouchableOpacity
        style={[styles.button, { borderWidth: 1, borderColor: '#dadce0', backgroundColor: colors.WHITE }, styles.loginButton]}
        onPress={handleGoogleLogin}
      >
        <Text style={[styles.buttonText, { color: '#3c4043' }]}>G  Login with Google</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#000000' }, styles.registerButton]}
          onPress={handleAppleLogin}
        >
          <Text style={[styles.buttonText, { color: colors.WHITE }]}>{'\uf8ff'}  Sign in with Apple</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.button, {borderWidth: 1, borderColor: colors.GREY}, {backgroundColor: colors.WHITE}, styles.guestButton]}
        onPress={handleAnonymousLogin}
      >
        <Text style={[styles.buttonText, {color: colors.GREY}]}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ 
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  container: { 
    width: '100%', 
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },  
  image: { width: '100%', height: '100%'},
  button: { 
    padding: 20, 
    borderRadius: 10,
    marginHorizontal: 40,
    width: '80%',
  },
  loginButton: {
    marginTop: 40,
  },
  registerButton: {
    marginTop: 20,
  },
  guestButton: {
    marginTop: 10,
  },
  buttonText: { 
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  }
}); 
