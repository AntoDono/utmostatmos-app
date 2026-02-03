// Marker colors based on tracker type
const markerColors = {
  recycle: '#4CAF50',    // Green
  compost: '#B46617',    // Brown (matches app secondary color)
  waste: '#808080',      // Grey
  default: '#6D9773',    // Light green (matches app primary)
};

export const getMarkerColor = (type) => {
  const normalizedType = type?.toLowerCase() || '';
  return markerColors[normalizedType] || markerColors.default;
};

export default markerColors;
