import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Pressable } from "react-native"
import React from 'react'
import colors from './../../constants/colors'
import { useRouter } from 'expo-router'

export default function SignIn() {
    const router=useRouter();
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

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Pressable 
          onPress={()=>router.push('/auth/signUp')}
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
    paddingBottom: 10,
  },
  logo: { 
    width: '80%', 
    height: '80%',
    maxWidth: 200,
    maxHeight: 200,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    width: '100%',
  },
  textInput: { 
    borderWidth: 1, 
    borderColor: colors.GREY,
    width: '100%', 
    padding: 16, 
    fontSize: 16, 
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: colors.WHITE,
    fontFamily: 'Montserrat-Regular',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  loginButton: {
    padding: 16,
    backgroundColor: colors.LIGHTGREEN,
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  loginButtonText: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: 16,
  },
  registerContainer: {
    alignItems: 'center',
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