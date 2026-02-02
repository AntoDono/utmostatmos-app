import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView from './MapView';
import { trackerAPI } from '../../utils/api';
import { Alert } from '../Alert';
import colors from '../../constants/colors';

export default function TrackerMap({ onTrackerSelect }) {
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrackers();
  }, []);

  const loadTrackers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trackerAPI.getTrackers();
      setTrackers(response.trackers || []);
    } catch (err) {
      setError(err.message || 'Failed to load trackers');
      Alert.alert('Error', err.message || 'Failed to load trackers');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (tracker) => {
    if (onTrackerSelect) {
      onTrackerSelect(tracker);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text 
          style={styles.retryText}
          onPress={loadTrackers}
        >
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        trackers={trackers}
        onMarkerPress={handleMarkerPress}
        style={styles.map}
      />
      {trackers.length === 0 && (
        <View style={styles.emptyOverlay}>
          <Text style={styles.emptyText}>No trackers available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  emptyOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  emptyText: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    color: colors.textMuted,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
