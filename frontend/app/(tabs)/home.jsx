import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import home_background from '../../assets/images/home_background.jpg';
import map from '../../assets/images/map.jpg';
import grass from '../../assets/images/grass.jpg';
import sky from '../../assets/images/sky.jpg';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

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
          {/* BOX 1 - Map */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/map')} activeOpacity={0.8}>
            <ImageBackground source={map} style={styles.box} imageStyle={styles.boxImage}>
              <Text style={styles.names}>Map</Text>
              <View style={styles.nextPage}>
                <Text style={styles.nextPageText}>Go to next page</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* BOX 2 - Contests */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/contests')} activeOpacity={0.8}>
            <ImageBackground source={sky} style={styles.box} imageStyle={styles.boxImage}>
              <Text style={styles.names}>Contests / Scholarships</Text>
              <View style={styles.nextPage}>
                <Text style={styles.nextPageText}>Go to next page</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* BOX 3 - Quiz */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/quiz')} activeOpacity={0.8}>
            <ImageBackground source={grass} style={styles.box} imageStyle={styles.boxImage}>
              <Text style={styles.names}>Quiz</Text>
              <View style={styles.nextPage}>
                <Text style={styles.nextPageText}>Go to next page</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* BOX 4 - Leaderboard */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/leaderboard')} activeOpacity={0.8}>
            <ImageBackground source={grass} style={styles.box} imageStyle={styles.boxImage}>
              <Text style={styles.names}>Leaderboard</Text>
              <View style={styles.nextPage}>
                <Text style={styles.nextPageText}>Go to next page</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* BOX 5 - Admin Dashboard */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/admin')} activeOpacity={0.8}>
            <ImageBackground source={sky} style={styles.box} imageStyle={styles.boxImage}>
              <Text style={styles.names}>Admin Dashboard</Text>
              <View style={styles.nextPage}>
                <Text style={styles.nextPageText}>Go to next page</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
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
    paddingTop: Math.max(20, height * 0.03),
    paddingBottom: 40,
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