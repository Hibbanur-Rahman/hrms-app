// Google Maps API Configuration
import ENV from './env';
export const GOOGLE_MAPS_CONFIG = {
  // Replace this with your actual Google Maps API key
  API_KEY: ENV.MAP_API_KEY,
  
  // Geocoding API endpoint
  GEOCODING_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
  
  // Reverse geocoding parameters
  REVERSE_GEOCODING_PARAMS: {
    result_type: 'street_address|route|premise|subpremise|establishment',
    location_type: 'ROOFTOP',
  },
};

// Helper function to get the full geocoding URL
export const getGeocodingUrl = (latitude: number, longitude: number): string => {
  console.log('latitude',latitude);
  console.log('longitude',longitude);
  console.log('API_KEY',GOOGLE_MAPS_CONFIG.API_KEY);
  const params = new URLSearchParams({
    latlng: `${latitude},${longitude}`,
    key: GOOGLE_MAPS_CONFIG.API_KEY,
    ...GOOGLE_MAPS_CONFIG.REVERSE_GEOCODING_PARAMS,
  });
  console.log('params',params.toString());
  return `${GOOGLE_MAPS_CONFIG.GEOCODING_URL}?${params.toString()}`;
};
