import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions } from 'react-native';
import home_background from '../../assets/images/home_background.jpg';
import map from '../../assets/images/map.jpg';
import grass from '../../assets/images/grass.jpg';
import sky from '../../assets/images/sky.jpg';

const { width, height } = Dimensions.get('window');

export default function Home() {
  return (
    <ImageBackground source={home_background} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Text style={[styles.title, { textDecorationLine: 'underline' }]}>Home</Text>

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

        <ImageBackground source={grass} style={styles.box} imageStyle={styles.boxImage}>
          <Text style={styles.names}>Leaderboard</Text>
          <View style={styles.nextPage}>
            <Text style={styles.nextPageText}>Go to next page</Text>
          </View>
        </ImageBackground>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 30,
    paddingTop:65
  },

  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 45,
    marginBottom: 25,
    
  },

  box1: {
    width: width * 0.8,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 2,        
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },

  box: {
    width: width * 0.8,
    height: height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 2,        
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },

  boxImage: {
    borderRadius: 12,
    opacity: 0.9, // slightly faded for readable text
  },

  names: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  nextPage: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  nextPageText: {
    color: 'white',
    fontWeight: '500',
  },
});
