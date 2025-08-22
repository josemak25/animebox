/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString(undefined, options || defaultOptions);
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (Math.abs(seconds) < 60) {
    return seconds >= 0 ? "just now" : "in a moment";
  } else if (Math.abs(minutes) < 60) {
    return minutes >= 0
      ? `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
      : `in ${Math.abs(minutes)} minute${Math.abs(minutes) !== 1 ? "s" : ""}`;
  } else if (Math.abs(hours) < 24) {
    return hours >= 0
      ? `${hours} hour${hours !== 1 ? "s" : ""} ago`
      : `in ${Math.abs(hours)} hour${Math.abs(hours) !== 1 ? "s" : ""}`;
  } else {
    return days >= 0
      ? `${days} day${days !== 1 ? "s" : ""} ago`
      : `in ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""}`;
  }
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}
