import { API_URL, MAP_API_KEY, NODE_ENV } from '@env';

// Environment configuration
export const ENV = {
  API_URL: API_URL || 'https://449eb6a6efab.ngrok-free.app/api',
  MAP_API_KEY: MAP_API_KEY || 'AIzaSyBK6uOPajk9Ncq-p-V8C9kiXBWiYfDbhDE',
  NODE_ENV: NODE_ENV || 'development',
  IS_DEVELOPMENT: NODE_ENV === 'development',
  IS_PRODUCTION: NODE_ENV === 'production',
  IS_TEST: NODE_ENV === 'test',
};

// Validate required environment variables
export const validateEnv = () => {
  const requiredVars = ['API_URL'];
  const missingVars = requiredVars.filter(varName => !ENV[varName as keyof typeof ENV]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  return missingVars.length === 0;
};

export default ENV;
