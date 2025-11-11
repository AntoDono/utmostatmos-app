import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Pressable, Dimensions } from "react-native"
import React from 'react'
import colors from './../../constants/colors'
import { useRouter } from 'expo-router'

const { width, height } = Dimensions.get('window');

const responsiveSize = (size) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

export default function SignIn() {
    const router = useRouter();
    
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
          placeholder="Username" 
          style={styles.textInput}
          placeholderTextColor={colors.GREY}
        />
        <TextInput 
          placeholder="Password" 
          secureTextEntry={true} 
          style={styles.textInput}
          placeholderTextColor={colors.GREY}
        />

        <Pressable style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/./../(tabs)/home')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
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
    paddingHorizontal: width * 0.1,
    justifyContent: 'space-between',
  },
  logoContainer: { 
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: responsiveSize(10),
    paddingTop: responsiveSize(20),
  },
  logo: { 
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 200,
    maxHeight: 200,
    minWidth: 120,
    minHeight: 120,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: responsiveSize(10),
  },
  title: {
    fontSize: responsiveSize(28),
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
    ...(width < 375 && { fontSize: responsiveSize(24) }), // Smaller iPhones
    ...(width > 414 && { fontSize: responsiveSize(32) }), // Larger iPhones
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    width: '100%',
    paddingVertical: responsiveSize(10),
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: responsiveSize(24),
    padding: responsiveSize(5),
  },
  forgotPasswordText: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Regular',
    fontSize: responsiveSize(14),
  },
  loginButton: {
    padding: responsiveSize(16),
    backgroundColor: colors.LIGHTGREEN,
    width: '100%',
    borderRadius: responsiveSize(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: responsiveSize(20),
    minHeight: responsiveSize(50),
    justifyContent: 'center',
  },
  loginButtonText: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveSize(16),
  },
  registerContainer: {
    alignItems: 'center',
    paddingVertical: responsiveSize(10),
  },
  registerText: {
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: colors.DARKGRAY,
    fontSize: responsiveSize(14),
  },
  registerLink: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
  },
  footerContainer: {
    flex: 1,
    minHeight: responsiveSize(20),
  },
});