import React, { useRef, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getMarkerColor } from './markerColors';

// Default center (San Francisco)
const DEFAULT_CENTER = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function MapViewComponent({
  trackers = [],
  onMarkerPress,
  style,
}) {
  const mapRef = useRef(null);

  // Calculate initial region from trackers
  const getInitialRegion = () => {
    if (trackers.length === 0) {
      return DEFAULT_CENTER;
    }

    if (trackers.length === 1) {
      return {
        latitude: trackers[0].latitude,
        longitude: trackers[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    // Calculate bounds for multiple trackers
    let minLat = trackers[0].latitude;
    let maxLat = trackers[0].latitude;
    let minLng = trackers[0].longitude;
    let maxLng = trackers[0].longitude;

    trackers.forEach(tracker => {
      minLat = Math.min(minLat, tracker.latitude);
      maxLat = Math.max(maxLat, tracker.latitude);
      minLng = Math.min(minLng, tracker.longitude);
      maxLng = Math.max(maxLng, tracker.longitude);
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.5; // Add 50% padding
    const lngDelta = (maxLng - minLng) * 1.5;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.05),
      longitudeDelta: Math.max(lngDelta, 0.05),
    };
  };

  // Fit map to show all markers when trackers change
  useEffect(() => {
    if (mapRef.current && trackers.length > 0) {
      const coordinates = trackers.map(t => ({
        latitude: t.latitude,
        longitude: t.longitude,
      }));

      // Give the map time to render before fitting bounds
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }, 100);
    }
  }, [trackers]);

  return (
    <MapView
      ref={mapRef}
      style={[styles.map, style]}
      initialRegion={getInitialRegion()}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {trackers.map((tracker) => (
        <Marker
          key={tracker.id}
          coordinate={{
            latitude: tracker.latitude,
            longitude: tracker.longitude,
          }}
          title={tracker.name}
          description={tracker.type}
          pinColor={getMarkerColor(tracker.type)}
          onPress={() => {
            if (onMarkerPress) {
              onMarkerPress(tracker);
            }
          }}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
