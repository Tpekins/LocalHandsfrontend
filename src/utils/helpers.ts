/**
 * Truncates a string to a specified length and appends an ellipsis if it's longer.
 * 
 * @param text The string to truncate.
 * @param maxLength The maximum length of the string.
 * @returns The truncated string.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formats a date string into a more readable format (e.g., 'June 19, 2025').
 * 
 * @param dateString The date string to format.
 * @returns The formatted date string.
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
