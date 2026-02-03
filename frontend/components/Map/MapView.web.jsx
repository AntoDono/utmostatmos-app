import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getMarkerColor } from './markerColors';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
// Create custom marker icons since default ones don't work well with bundlers
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="5"/>
      </svg>
    `,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -35],
  });
};

// Component to fit map bounds to markers
function FitBounds({ trackers }) {
  const map = useMap();

  useEffect(() => {
    if (trackers && trackers.length > 0) {
      const bounds = L.latLngBounds(
        trackers.map(t => [t.latitude, t.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [trackers, map]);

  return null;
}

// Default center (San Francisco)
const DEFAULT_CENTER = [37.7749, -122.4194];
const DEFAULT_ZOOM = 12;

export default function MapView({
  trackers = [],
  onMarkerPress,
  style,
}) {
  // Calculate initial center from trackers
  const center = trackers.length > 0
    ? [trackers[0].latitude, trackers[0].longitude]
    : DEFAULT_CENTER;

  const containerStyle = {
    width: '100%',
    height: '100%',
    ...style,
  };

  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      style={containerStyle}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {trackers.length > 0 && <FitBounds trackers={trackers} />}
      
      {trackers.map((tracker) => (
        <Marker
          key={tracker.id}
          position={[tracker.latitude, tracker.longitude]}
          icon={createMarkerIcon(getMarkerColor(tracker.type))}
          eventHandlers={{
            click: () => {
              if (onMarkerPress) {
                onMarkerPress(tracker);
              }
            },
          }}
        >
          <Popup>
            <div>
              <strong>{tracker.name}</strong>
              <br />
              <span style={{ 
                color: getMarkerColor(tracker.type),
                fontWeight: '500',
                textTransform: 'capitalize',
              }}>
                {tracker.type}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
