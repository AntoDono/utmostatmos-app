import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import home_background from '../../assets/images/home_background.jpg';
import map from '../../assets/images/map.jpg';
import grass from '../../assets/images/grass.jpg';
import sky from '../../assets/images/sky.jpg';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ImageBackground 
      source={home_background} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.overlay}>
          {/* Header with logout button */}
          <View style={styles.header}>
            <Text style={[styles.title, { textDecorationLine: 'underline' }]}>Home</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* BOX 1 */}
          <ImageBackground source={map} style={styles.box} imageStyle={styles.boxImage}>
            <Text style={styles.names}>Map</Text>
            <View style={styles.nextPage}>
              <Text style={styles.nextPageText}>Go to next page</Text>
            </View>
          </ImageBackground>

          {/* BOX 2 */}
          <ImageBackground source={sky} style={styles.box} imageStyle={styles.boxImage}>
            <Text style={styles.names}>Contests / Scholarships</Text>
            <View style={styles.nextPage}>
              <Text style={styles.nextPageText}>Go to next page</Text>
            </View>
          </ImageBackground>

          {/* BOX 3 */}
          <ImageBackground source={grass} style={styles.box} imageStyle={styles.boxImage}>
            <Text style={styles.names}>Quiz</Text>
            <View style={styles.nextPage}>
              <Text style={styles.nextPageText}>Go to next page</Text>
            </View>
          </ImageBackground>

          {/* BOX 4 */}
          <ImageBackground source={grass} style={styles.box} imageStyle={styles.boxImage}>
            <Text style={styles.names}>Leaderboard</Text>
            <View style={styles.nextPage}>
              <Text style={styles.nextPageText}>Go to next page</Text>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },

  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 40,
    paddingTop: Math.max(60, height * 0.08),
    paddingBottom: 40,
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: Math.max(20, height * 0.03),
    position: 'relative',
  },

  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: Math.min(45, width * 0.12),
  },

  logoutButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },

  box: {
    width: Math.min(width * 0.85, 400),
    height: Math.max(height * 0.13, 100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Math.max(15, height * 0.02),
    borderWidth: 2,        
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },

  boxImage: {
    borderRadius: 12,
    opacity: 0.9,
  },

  names: {
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  nextPage: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  nextPageText: {
    color: 'white',
    fontWeight: '500',
    fontSize: Math.min(14, width * 0.035),
  },
});