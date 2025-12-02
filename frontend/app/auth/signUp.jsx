import { Text, View, StyleSheet, TextInput, TouchableOpacity, Pressable, ScrollView, Dimensions } from "react-native"
import React, { useState } from 'react'
import colors from './../../constants/colors'
import { useRouter } from 'expo-router'
import { authAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'

const { width, height } = Dimensions.get('window');

const responsiveSize = (size) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

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
    minHeight: height,
  },
  container: { 
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: width * 0.1,
    paddingVertical: responsiveSize(40),
    minHeight: height,
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: responsiveSize(40),
    marginTop: height * 0.1,
    ...(height < 700 && { marginTop: responsiveSize(20) }), // Smaller screens
    ...(height > 800 && { marginTop: height * 0.15 }), // Larger screens
  },
  title: {
    fontSize: responsiveSize(28),
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
    ...(width < 375 && { fontSize: responsiveSize(24) }), // Smaller iPhones
    ...(width > 414 && { fontSize: responsiveSize(32) }), // Larger iPhones
  },
  formContainer: {
    width: '100%',
  },
  textInput: { 
    borderWidth: 1, 
    borderColor: colors.GREY,
    width: '100%', 
    padding: responsiveSize(16), 
    fontSize: responsiveSize(16), 
    borderRadius: responsiveSize(10),
    marginBottom: responsiveSize(16),
    backgroundColor: colors.WHITE,
    fontFamily: 'Montserrat-Regular',
    minHeight: responsiveSize(50),
  },
  signUpButton: {
    padding: responsiveSize(16),
    backgroundColor: colors.LIGHTGREEN,
    width: '100%',
    borderRadius: responsiveSize(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: responsiveSize(10),
    marginBottom: responsiveSize(20),
    minHeight: responsiveSize(50),
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveSize(16),
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: responsiveSize(10),
  },
  loginText: {
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: colors.DARKGRAY,
    fontSize: responsiveSize(14),
  },
  loginLink: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
  },
});