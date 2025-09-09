import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getApiUrl, getBaseUrl } from '../config/env';

/**
 * Custom hook to get the current API URL that updates when Redux state changes
 * @returns {string} The current API URL with /api suffix
 */
export const useApiUrl = (): string => {
  const baseUrl = useSelector((state: RootState) => state.config.baseUrl);
  
  // This will re-compute whenever baseUrl changes in Redux
  if (baseUrl) {
    return `${baseUrl}/api`;
  }
  
  return getApiUrl(); // Fallback to the function that handles defaults
};

/**
 * Custom hook to get the current base URL that updates when Redux state changes
 * @returns {string} The current base URL without /api suffix
 */
export const useBaseUrl = (): string => {
  const baseUrl = useSelector((state: RootState) => state.config.baseUrl);
  
  // This will re-compute whenever baseUrl changes in Redux
  if (baseUrl) {
    return baseUrl;
  }
  
  return getBaseUrl(); // Fallback to the function that handles defaults
};
