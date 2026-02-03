import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../constants/colors';

export default function CustomHeader({ title }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={28} color={colors.DARKGREEN} />
        </TouchableOpacity>
        
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.WHITE,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
    width: 44,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: colors.DARKGREEN,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
});
