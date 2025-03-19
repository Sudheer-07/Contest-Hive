
/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

/**
 * Calculates time remaining until a future date
 * @param dateString ISO date string
 */
export const getTimeRemaining = (dateString: string): string => {
  const targetDate = new Date(dateString).getTime();
  const now = new Date().getTime();
  
  // If the date is in the past
  if (targetDate <= now) {
    return 'Ended';
  }
  
  const timeRemaining = targetDate - now;
  
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Formats duration in seconds to a human-readable format
 * @param seconds Duration in seconds
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Checks if a contest is ongoing
 * @param startTime ISO date string for start time
 * @param endTime ISO date string for end time
 */
export const isContestOngoing = (startTime: string, endTime: string): boolean => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  
  return now >= start && now <= end;
};

/**
 * Checks if a contest is upcoming
 * @param startTime ISO date string for start time
 */
export const isUpcoming = (startTime: string): boolean => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  
  return start > now;
};

/**
 * Checks if a contest is finished
 * @param endTime ISO date string for end time
 */
export const isPast = (endTime: string): boolean => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  
  return end < now;
};
