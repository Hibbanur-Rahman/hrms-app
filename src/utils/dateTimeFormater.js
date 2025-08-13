import { parseISO } from "date-fns";

// Function to format date and time
function formatDateTime(dateString) {
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat('en-IN', options);
  return formatter.format(new Date(dateString));
}

function formatTime(dateString) {
  if (!dateString) return 'N/A';

  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  };
  const formatter = new Intl.DateTimeFormat('en-IN', options);
  return formatter.format(new Date(dateString));
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';

  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('en-IN', options);
  return formatter.format(new Date(dateString));
}

const calculateDurationInMinutes = (checkInTime, checkOutTime) => {
  try {
    // Ensure we have valid dates
    if (!checkInTime || !checkOutTime) {
      console.log('Missing check-in or check-out time');
      return 0;
    }

    // Convert ISO strings to Date objects if they aren't already
    const startTime =
      checkInTime instanceof Date ? checkInTime : new Date(checkInTime);
    const endTime =
      checkOutTime instanceof Date ? checkOutTime : new Date(checkOutTime);

    // Validate dates
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.log('Invalid date format');
      return 0;
    }

    // Calculate difference in milliseconds
    const diffInMs = endTime.getTime() - startTime.getTime();

    // Convert to minutes and round
    const minutes = Math.round(diffInMs / (1000 * 60));

    // Ensure we don't return negative duration
    return minutes > 0 ? minutes : 0;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

  // Format duration in hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} min`;
    }

    return `${hours}h ${mins}m`;
  };

  const formatISOToDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };
export {
  formatDateTime,
  formatTime,
  formatDate,
  calculateDurationInMinutes,
  formatDuration,
  formatISOToDate,
};
