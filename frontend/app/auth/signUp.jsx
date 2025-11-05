import { Text, View, StyleSheet, TextInput, TouchableOpacity, Pressable, ScrollView } from "react-native"
import React from 'react'
import colors from './../../constants/colors'
import { useRouter } from 'expo-router'

export default function SignUp() {
    const router=useRouter();
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            onPress={()=>router.push('/auth/signIn')}
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
    backgroundColor: colors.WHITE,
    paddingHorizontal: '10%',
    paddingVertical: 60,
  },
  headerContainer: {
    alignItems: 'left',
    marginBottom: 40,
    marginTop: '40%',
  },
  title: {
    fontSize: 28,
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
    padding: 16, 
    fontSize: 16, 
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: colors.WHITE,
    fontFamily: 'Montserrat-Regular',
  },
  signUpButton: {
    padding: 16,
    backgroundColor: colors.LIGHTGREEN,
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: 16,
  },
  loginContainer: {
    alignItems: 'center',
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