import store from '../redux/store';
import { handleSetBaseUrl } from '../redux/slices/config/configSlice';
import { getApiUrl, getBaseUrl } from '../config/env';

/**
 * Utility function to test API URL updates when Redux state changes
 * This can be used in development to verify that the API URL updates correctly
 */
export const testApiUrlUpdate = () => {
  console.log('=== Testing API URL Updates ===');
  
  // Test 1: Initial state
  console.log('1. Initial API URL:', getApiUrl());
  console.log('1. Initial Base URL:', getBaseUrl());
  console.log('1. Redux state:', store.getState().config.baseUrl);
  
  // Test 2: Update Redux state
  const testUrl = 'https://test.example.com';
  store.dispatch(handleSetBaseUrl({ baseUrl: testUrl }));
  
  console.log('2. After Redux update:');
  console.log('2. New API URL:', getApiUrl());
  console.log('2. New Base URL:', getBaseUrl());
  console.log('2. Redux state:', store.getState().config.baseUrl);
  
  // Test 3: Another update
  const anotherTestUrl = 'https://another.example.com';
  store.dispatch(handleSetBaseUrl({ baseUrl: anotherTestUrl }));
  
  console.log('3. After second update:');
  console.log('3. New API URL:', getApiUrl());
  console.log('3. New Base URL:', getBaseUrl());
  console.log('3. Redux state:', store.getState().config.baseUrl);
  
  console.log('=== Test Complete ===');
};

/**
 * Function to log current API configuration
 * Useful for debugging
 */
export const logCurrentApiConfig = () => {
  console.log('=== Current API Configuration ===');
  console.log('API URL:', getApiUrl());
  console.log('Base URL:', getBaseUrl());
  console.log('Redux Base URL:', store.getState().config.baseUrl);
  console.log('================================');
};
