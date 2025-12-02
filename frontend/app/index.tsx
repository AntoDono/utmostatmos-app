import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native"
import colors from './../constants/colors'
import { useRouter } from "expo-router"

const router = useRouter()

export default function Index() {
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
  buttonText: { 
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  }
}); 
