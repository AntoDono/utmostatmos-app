import { Text, View, StyleSheet, TextInput, TouchableOpacity, Pressable, ScrollView } from "react-native"
import React, { useState } from 'react'
import colors from './../../constants/colors'
import { useRouter } from 'expo-router'
import { authAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'

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
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sign Up</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput 
            placeholder="First Name" 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput 
            placeholder="Last Name" 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput 
            placeholder="Email" 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput 
            placeholder="Password" 
            secureTextEntry={true} 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <TextInput 
            placeholder="Confirm Password" 
            secureTextEntry={true} 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity 
            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.signUpButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Pressable
              onPress={() => router.push('/auth/signIn')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ 
  scrollContainer: {
    flexGrow: 1,
  },
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: '3%',
    marginTop: '5%',
  },
  title: {
    fontSize: 24,
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
  },
  formContainer: {
    width: '100%',
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
  signUpButton: {
    padding: '3%',
    backgroundColor: colors.LIGHTGREEN,
    width: '100%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: '2%',
    marginBottom: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: 14,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: '2%',
  },
  loginText: {
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: colors.DARKGRAY,
    fontSize: 14,
  },
  loginLink: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
  },
});