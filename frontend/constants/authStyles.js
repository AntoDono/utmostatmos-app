import { StyleSheet } from 'react-native';
import colors from './colors';

export const authStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.surface,
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
    color: colors.primary,
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
    borderColor: colors.inputBorder,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.inputBackground,
    fontFamily: 'Montserrat-Regular',
    height: 48,
  },

  // Button styles
  button: {
    paddingVertical: 14,
    backgroundColor: colors.primary,
    width: '100%',
    borderRadius: 8,
    shadowColor: colors.shadow,
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
    color: colors.textOnPrimary,
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
    color: colors.textSecondary,
    fontSize: 14,
  },

  linkTextBold: {
    color: colors.primary,
    fontFamily: 'Montserrat-Bold',
  },

  // Forgot password styles
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4,
  },

  forgotPasswordText: {
    color: colors.primary,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },

  // Social login buttons
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
  },

  googleButtonText: {
    color: '#3c4043',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 10,
  },

  googleIcon: {
    width: 20,
    height: 20,
  },

  appleButton: {
    backgroundColor: '#000000',
  },

  appleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 8,
  },

  appleIcon: {
    fontSize: 20,
    color: '#ffffff',
    lineHeight: 24,
  },

  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  socialDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },

  socialDividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#9e9e9e',
    fontFamily: 'Montserrat-Regular',
  },

  // Footer
  footerContainer: {
    height: 40,
  },
});

