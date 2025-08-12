import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { getGeocodingUrl } from '../config/googleMapsConfig';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

class LocationService {
  // Request location permissions
  requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      // iOS permissions are handled by the library automatically
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location for attendance tracking.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Error requesting location permission:', err);
      return false;
    }
  };

  // Get current location
  getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      console.log('Requesting location...');
      
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('position', position);
          const { latitude, longitude } = position.coords;
          resolve({
            latitude,
            longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          
          // Provide more specific error messages
          let errorMessage = 'Unknown location error';
          switch (error.code) {
            case 1:
              errorMessage = 'Location permission denied';
              break;
            case 2:
              errorMessage = 'Location unavailable';
              break;
            case 3:
              errorMessage = 'Location request timed out';
              break;
            case 4:
              errorMessage = 'Activity is null';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: false, // Changed to false for faster response
          timeout: 30000, // Increased timeout to 30 seconds
          maximumAge: 60000, // Increased to 1 minute
        }
      );
    });
  };

  // Reverse geocoding using Google Maps API
  getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      const url = getGeocodingUrl(latitude, longitude);
      console.log('url',url);

      const response = await fetch(url);
      const data = await response.json();
      console.log('data',data);
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Address not available';
    }
  };

  // Get location with address
  getLocationWithAddress = async (): Promise<LocationData> => {
    try {
      const hasPermission = await this.requestLocationPermission();
      console.log('hasPermission', hasPermission);
      
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions to use the check-in feature.'
        );
        throw new Error('Location permission denied');
      }

      console.log('Attempting to get current location...');
      const location = await this.getCurrentLocation();
      console.log('location with coordinates',location);
      const address = await this.getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );

      return {
        ...location,
        address,
      };
    } catch (error) {
      console.error('Error getting location with address:', error);
      
      // Provide more helpful error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('timed out')) {
        throw new Error('Location request timed out. Please check your GPS settings and ensure you have a good signal.');
      } else if (errorMessage.includes('unavailable')) {
        throw new Error('Location is currently unavailable. Please try again in a moment.');
      } else if (errorMessage.includes('permission denied')) {
        throw new Error('Location permission denied. Please enable location access in your device settings.');
      } else {
        throw new Error('Unable to get location. Please check your GPS settings and try again.');
      }
    }
  };
}

export default new LocationService();
