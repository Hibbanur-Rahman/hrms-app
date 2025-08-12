import { API_URL, MAP_API_KEY } from '@env';

// Fallback values in case environment variables are not loaded
const DEFAULT_API_URL = 'https://449eb6a6efab.ngrok-free.app/api';
const DEFAULT_MAP_API_KEY = 'AIzaSyBK6uOPajk9Ncq-p-V8C9kiXBWiYfDbhDE';

// Use environment variables with fallbacks
const finalApiUrl = API_URL || DEFAULT_API_URL;
const finalMapApiKey = MAP_API_KEY || DEFAULT_MAP_API_KEY;

export default finalApiUrl;
export { finalApiUrl as API_URL, finalMapApiKey as MAP_API_KEY };
