import { Text, View, StyleSheet, TextInput, TouchableOpacity, Pressable, ScrollView, Dimensions } from "react-native"
import React from 'react'
import colors from './../../constants/colors'
import { useRouter } from 'expo-router'

const { width, height } = Dimensions.get('window');

const responsiveSize = (size) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

export default function SignUp() {
    const router = useRouter();
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
            placeholder="Full Name" 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
          />
          <TextInput 
            placeholder="Username" 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            autoCapitalize="none"
          />
          <TextInput 
            placeholder="Email" 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput 
            placeholder="Password" 
            secureTextEntry={true} 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            autoCapitalize="none"
          />
          <TextInput 
            placeholder="Confirm Password" 
            secureTextEntry={true} 
            style={styles.textInput}
            placeholderTextColor={colors.GREY}
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Create Account</Text>
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