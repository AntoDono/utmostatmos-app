import { Text, View, Image, TextInput, TouchableOpacity, Pressable, ScrollView } from "react-native"
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { authAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'
import { authStyles } from '../../constants/authStyles'

export default function SignUp() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }

      setLoading(true);
      try {
        const response = await authAPI.signup(email, password, firstName, lastName);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.push('/auth/signIn') }
        ]);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to create account');
      } finally {
        setLoading(false);
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
          <Text style={authStyles.title}>Sign Up</Text>
        </View>

        <View style={authStyles.formContainer}>
          <TextInput 
            placeholder="First Name" 
            style={authStyles.textInput}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput 
            placeholder="Last Name" 
            style={authStyles.textInput}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput 
            placeholder="Email" 
            style={authStyles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput 
            placeholder="Password" 
            secureTextEntry={true} 
            style={authStyles.textInput}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <TextInput 
            placeholder="Confirm Password" 
            secureTextEntry={true} 
            style={authStyles.textInput}
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity 
            style={[authStyles.button, loading && authStyles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={authStyles.buttonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
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
        </View>
      </View>
    </ScrollView>
  );
}