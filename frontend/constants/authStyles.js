import { StyleSheet } from 'react-native';
import colors from './colors';

export const authStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  
  scrollContainer: {
    flexGrow: 1,
  },

  // Logo styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  logo: {
    width: 120,
    height: 120,
  },

  // Header styles
  headerContainer: {
    marginBottom: 32,
  },
  
  title: {
    fontSize: 28,
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },

  // Form styles
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },

  // Input styles
  textInput: {
    borderWidth: 1,
    borderColor: colors.GREY,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.WHITE,
    fontFamily: 'Montserrat-Regular',
    height: 48,
  },

  // Button styles
  button: {
    paddingVertical: 14,
    backgroundColor: colors.LIGHTGREEN,
    width: '100%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },

  buttonText: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  // Link styles
  linkContainer: {
    alignItems: 'center',
    marginTop: 16,
  },

  linkText: {
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: colors.DARKGRAY,
    fontSize: 14,
  },

  linkTextBold: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
  },

  // Forgot password styles
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4,
  },

  forgotPasswordText: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },

  // Footer
  footerContainer: {
    height: 40,
  },
});

