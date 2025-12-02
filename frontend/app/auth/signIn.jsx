import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from 'react'
import colors from './../../constants/colors'
import { useRouter } from 'expo-router'
import { authAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter email and password');
        return;
      }

      setLoading(true);
      try {
        const response = await authAPI.login(email, password);
        // SessionId is automatically stored by authAPI.login
        Alert.alert('Success', 'Logged in successfully!', [
          { text: 'OK', onPress: () => router.push('/(tabs)/home') }
        ]);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to login');
      } finally {
        setLoading(false);
      }
    };
    
  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
        <Image 
          source={require('./../../assets/images/Final-Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        /> 
      </View> 
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput 
          placeholder="Email" 
          style={styles.textInput}
          placeholderTextColor={colors.GREY}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          placeholder="Password" 
          secureTextEntry={true} 
          style={styles.textInput}
          placeholderTextColor={colors.GREY}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Pressable 
            onPress={() => router.push('/auth/signUp')}
          >
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerLink}>Register</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footerContainer} />
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: '10%',
    justifyContent: 'space-between',
  },
  logoContainer: { 
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '2%',
    paddingTop: '3%',
  },
  logo: { 
    width: 200,
    height: 200,
    maxWidth: 200,
    maxHeight: 200,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    width: '100%',
    paddingVertical: '2%',
  },
  textInput: { 
    borderWidth: 1, 
    borderColor: colors.GREY,
    width: '100%', 
    padding: '3%',
    fontSize: 14, 
    borderRadius: 8,
    marginBottom: '2%',
    backgroundColor: colors.WHITE,
    fontFamily: 'Montserrat-Regular',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: '3%',
    padding: '1%',
  },
  forgotPasswordText: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  loginButton: {
    padding: '3%',
    backgroundColor: colors.LIGHTGREEN,
    width: '100%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: 14,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  registerContainer: {
    alignItems: 'center',
    paddingVertical: '2%',
  },
  registerText: {
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: colors.DARKGRAY,
    fontSize: 14,
  },
  registerLink: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
  },
  footerContainer: {
    flex: 1,
  },
});