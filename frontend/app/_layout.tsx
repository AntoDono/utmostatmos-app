import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { CustomAlert } from "../components/Alert";
import { NotificationOverlay } from "../components/Notification";
import { AuthProvider } from "../context/AuthContext";
import 'react-native-gesture-handler';

export default function RootLayout() {

  useFonts({
    'playfair': require('./../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'playfair-medium': require('./../assets/fonts/PlayfairDisplay-Medium.ttf'),
    'playfair-bold': require('./../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'montserrat': require('./../assets/fonts/Montserrat-Regular.ttf'),
    'montserrat-medium': require('./../assets/fonts/Montserrat-Medium.ttf'),
    'montserrat-bold': require('./../assets/fonts/Montserrat-Bold.ttf')
  })

  return  (
    <AuthProvider>
      <Stack screenOptions={{
        headerShown: false
      }}>

      </Stack>
      <CustomAlert />
      <NotificationOverlay />
    </AuthProvider>
  )
}
