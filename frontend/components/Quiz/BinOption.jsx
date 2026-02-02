import { Pressable, Animated, Image, Text, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import colors from '../../constants/colors';

const BinOption = ({ bin, onPress, disabled, isCorrect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={styles.binOption}
    >
      <Animated.View
        style={[
          styles.binContainer,
          { transform: [{ scale: scaleAnim }] },
          isCorrect && styles.correctBinContainer,
        ]}
      >
        <Image
          source={bin.image}
          style={styles.binImage}
          resizeMode="contain"
        />
        <Text style={styles.binLabel}>{bin.label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  binOption: {},
  binContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 15,
    minWidth: 90,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.border,
  },
  correctBinContainer: {
    borderWidth: 3,
    borderColor: colors.success,
    backgroundColor: colors.successLight,
    shadowColor: colors.success,
    shadowOpacity: 0.3,
  },
  binImage: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  binLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
});

export default BinOption;
