/**
 * Format distance in user-friendly format
 * @param {number} distance - Distance in meters
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance === null || distance === undefined || isNaN(distance)) {
    return 'N/A';
  }
  
  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  } else {
    const kilometers = distance / 1000;
    return `${kilometers.toFixed(2)} km`;
  }
};


export default {
  formatDistance,
}; 