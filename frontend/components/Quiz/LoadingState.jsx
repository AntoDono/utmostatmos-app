import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import colors from '../../constants/colors';

export const LoadingState = () => (
  <View style={[styles.container, styles.centerContent]}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Loading quizzes...</Text>
  </View>
);

export const ErrorState = ({ error, onRetry }) => (
  <View style={[styles.container, styles.centerContent]}>
    <Text style={styles.errorText}>{error}</Text>
    <Pressable
      style={({ pressed }) => [
        styles.retryButton,
        pressed && styles.buttonPressed
      ]}
      onPress={onRetry}
    >
      <Text style={styles.retryButtonText}>Retry</Text>
    </Pressable>
  </View>
);

export const EmptyState = () => (
  <View style={[styles.container, styles.centerContent]}>
    <Text style={styles.errorText}>No quizzes available</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
