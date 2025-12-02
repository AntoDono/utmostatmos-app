import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { trackerAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'

export default function Map() {
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrackers();
  }, []);

  const loadTrackers = async () => {
    try {
      setLoading(true);
      const response = await trackerAPI.getTrackers();
      setTrackers(response.trackers || []);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load trackers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading trackers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trackers</Text>
      {trackers.length === 0 ? (
        <Text style={styles.emptyText}>No trackers available</Text>
      ) : (
        <FlatList
          data={trackers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.trackerItem}>
              <Text style={styles.trackerName}>{item.name}</Text>
              <Text style={styles.trackerType}>Type: {item.type}</Text>
              <Text style={styles.trackerLocation}>
                Location: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  trackerItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  trackerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  trackerType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  trackerLocation: {
    fontSize: 12,
    color: '#999',
  },
});