import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native"
import colors from './../constants/colors'
import { useRouter } from "expo-router"

const router = useRouter()

export default function Index() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.WHITE
    }}>

      <View style={styles.container} > 
        <Image 
          source={require('./../assets/images/Final-Logo.png')}
          style={styles.image}
          resizeMode="contain"
        /> 
      </View> 

      <TouchableOpacity style={[styles.button, {borderWidth: 1}, {backgroundColor: colors.DARKGREEN}, {marginTop: '20%'}]}
        onPress={()=>router.push('/auth/signIn')}
      >
        <Text style={[styles.buttonText, {color: colors.WHITE}]}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {borderWidth: 1}, {backgroundColor: colors.WHITE}, {marginTop: '5%'}]}
        onPress={()=>router.push('/auth/signUp')}
      >
        <Text style={[styles.buttonText, {color: colors.GREY}]}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { width: '100%', height: 250, marginTop: '50%'},  
  image: { width: '100%', height: '100%'},
  button: { padding: 20, 
            borderRadius: 10,
            marginHorizontal: 40,
          },
  buttonText: { textAlign: 'center',
                fontSize: 16,
                fontFamily: 'Montserrat-Bold',
          }
}); 
