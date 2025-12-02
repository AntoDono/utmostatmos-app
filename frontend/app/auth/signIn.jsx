import { Text, View, Image, TextInput, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { authAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'
import { authStyles } from '../../constants/authStyles'

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
        <TextInput 
          placeholder="Email" 
          style={authStyles.textInput}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          placeholder="Password" 
          secureTextEntry={true} 
          style={authStyles.textInput}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={authStyles.forgotPasswordContainer}>
          <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>

        <TouchableOpacity 
          style={[authStyles.button, loading && authStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={authStyles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
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
      </View>

      <View style={authStyles.footerContainer} />
    </View>
  );
}