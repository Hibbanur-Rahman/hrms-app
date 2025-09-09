import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../redux/store";
// Try to import environment variables, fallback to defaults if not available
let API_URL: string | undefined;
let MAP_API_KEY: string | undefined;
let NODE_ENV: string | undefined;


try {
  const env = require('@env');
  API_URL = env.API_URL;
  MAP_API_KEY = env.MAP_API_KEY;
  NODE_ENV = env.NODE_ENV;

  console.log('API_URL', API_URL);
  console.log('BASE_URL from store:', store?.getState()?.config?.baseUrl);
  console.log('MAP_API_KEY', MAP_API_KEY);
  console.log('NODE_ENV', NODE_ENV);
} catch (error) {
  console.warn('Environment variables not loaded, using defaults');
  API_URL = undefined;
  MAP_API_KEY = undefined;
  NODE_ENV = undefined;
}

// Function to get dynamic base URL from Redux store
export const getApiUrl = (): string => {
  try {
    const baseUrl = store?.getState()?.config?.baseUrl;
    console.log("base url from redux:", baseUrl);
    
    if (baseUrl) {
      return `${baseUrl}/api`;
    }
    
    // Fallback to environment variable or default URL
    return API_URL || 'https://88fa1e1eea89.ngrok-free.app/api';
  } catch (error) {
    console.log("error while getting base url:", error);
    return API_URL || 'https://88fa1e1eea89.ngrok-free.app/api';
  }
}

// Helper function to get the current base URL without /api suffix
export const getBaseUrl = (): string => {
  try {
    const baseUrl = store?.getState()?.config?.baseUrl;
    return baseUrl || 'https://88fa1e1eea89.ngrok-free.app';
  } catch (error) {
    console.log("error while getting base url:", error);
    return 'https://88fa1e1eea89.ngrok-free.app';
  }
}

// Environment configuration
export const ENV = {
  // Use environment variable as fallback, but getApiUrl() will provide dynamic URL
  API_URL: API_URL || 'https://88fa1e1eea89.ngrok-free.app/api',
  MAP_API_KEY: MAP_API_KEY || 'AIzaSyBK6uOPajk9Ncq-p-V8C9kiXBWiYfDbhDE',
  NODE_ENV: NODE_ENV || 'development',
  IS_DEVELOPMENT: (NODE_ENV || 'development') === 'development',
  IS_PRODUCTION: (NODE_ENV || 'development') === 'production',
  IS_TEST: (NODE_ENV || 'development') === 'test',
};

// Validate required environment variables
export const validateEnv = () => {
  const currentApiUrl = getApiUrl();
  console.log('Current API URL:', currentApiUrl);
  console.log('ENV', ENV);
  
  const requiredVars = ['API_URL'];
  console.log('requiredVars', requiredVars);
  
  // Check if we have a valid API URL (either from Redux or fallback)
  const hasValidApiUrl = currentApiUrl && currentApiUrl.trim() !== '';
  
  if (!hasValidApiUrl) {
    console.warn(`Missing or invalid API URL. Current: ${currentApiUrl}`);
    return false;
  }

  return true;
};

export default ENV;
