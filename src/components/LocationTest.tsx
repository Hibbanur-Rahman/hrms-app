import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import LocationService from '../services/LocationService';

const LocationTest = () => {
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLocation = async () => {
    try {
      setLoading(true);
      console.log('Starting location test...');
      
      const data = await LocationService.getLocationWithAddress();
      setLocationData(data);
      
      console.log('Location test successful:', data);
      Alert.alert(
        'Location Test Successful',
        `Latitude: ${data.latitude}\nLongitude: ${data.longitude}\nAddress: ${data.address}`
      );
    } catch (error) {
      console.error('Location test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Location Test Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4 bg-gray-100 rounded-lg m-4">
      <Text className="text-lg font-bold mb-2">Location Test</Text>
      <TouchableOpacity
        onPress={testLocation}
        disabled={loading}
        className={`p-3 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
      >
        <Text className="text-white text-center">
          {loading ? 'Getting Location...' : 'Test Location'}
        </Text>
      </TouchableOpacity>
      
      {locationData && (
        <View className="mt-4 p-3 bg-white rounded-lg">
          <Text className="font-semibold">Location Data:</Text>
          <Text>Latitude: {locationData.latitude}</Text>
          <Text>Longitude: {locationData.longitude}</Text>
          <Text>Address: {locationData.address}</Text>
        </View>
      )}
    </View>
  );
};

export default LocationTest;
