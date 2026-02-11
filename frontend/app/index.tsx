import { Image, Text, View, StyleSheet, TouchableOpacity, Platform } from "react-native"
import colors from './../constants/colors'
import { useRouter } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Index() {
  const router = useRouter()
  
  const handleAnonymousLogin = async () => {
    try {
      // Set anonymous flag in storage
      await AsyncStorage.setItem('isAnonymous', 'true')
      
      // For web only, trigger the auth-changed event
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'))
      }
      
      // Navigate to home screen
      router.replace('/(tabs)/home')
    } catch (error) {
      console.error('Error setting anonymous mode:', error)
    }
  }
  
  return (
    <View style={styles.mainContainer}>

      <View style={styles.container} > 
        <Image 
          source={require('./../assets/images/Final-Logo.png')}
          style={styles.image}
          resizeMode="contain"
        /> 
      </View> 

      <TouchableOpacity style={[styles.button, {borderWidth: 1}, {backgroundColor: colors.DARKGREEN}, styles.loginButton]}
        onPress={()=>router.push('/auth/signIn')}
      >
        <Text style={[styles.buttonText, {color: colors.WHITE}]}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {borderWidth: 1}, {backgroundColor: colors.WHITE}, styles.registerButton]}
        onPress={()=>router.push('/auth/signUp')}
      >
        <Text style={[styles.buttonText, {color: colors.GREY}]}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {borderWidth: 1, borderColor: colors.GREY}, {backgroundColor: colors.WHITE}, styles.guestButton]}
        onPress={handleAnonymousLogin}
      >
        <Text style={[styles.buttonText, {color: colors.GREY}]}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ 
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  container: { 
    width: '100%', 
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },  
  image: { width: '100%', height: '100%'},
  button: { 
    padding: 20, 
    borderRadius: 10,
    marginHorizontal: 40,
    width: '80%',
  },
  loginButton: {
    marginTop: 40,
  },
  registerButton: {
    marginTop: 20,
  },
  guestButton: {
    marginTop: 10,
  },
  buttonText: { 
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  }
}); 
