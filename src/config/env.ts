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
  console.log('MAP_API_KEY', MAP_API_KEY);
  console.log('NODE_ENV', NODE_ENV);
} catch (error) {
  console.warn('Environment variables not loaded, using defaults');
  API_URL = undefined;
  MAP_API_KEY = undefined;
  NODE_ENV = undefined;
}

// Environment configuration
export const ENV = {
  API_URL: API_URL || 'https://5dab02298812.ngrok-free.app/api',
  MAP_API_KEY: MAP_API_KEY || 'AIzaSyBK6uOPajk9Ncq-p-V8C9kiXBWiYfDbhDE',
  NODE_ENV: NODE_ENV || 'development',
  IS_DEVELOPMENT: (NODE_ENV || 'development') === 'development',
  IS_PRODUCTION: (NODE_ENV || 'development') === 'production',
  IS_TEST: (NODE_ENV || 'development') === 'test',
};

// Validate required environment variables
export const validateEnv = () => {
  const requiredVars = ['API_URL'];
  console.log('ENV', ENV);
  console.log('requiredVars',requiredVars);
  const missingVars = requiredVars.filter(varName => !ENV[varName as keyof typeof ENV]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  return missingVars.length === 0;
};

export default ENV;
