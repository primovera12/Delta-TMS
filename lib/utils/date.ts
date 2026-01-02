import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date to a readable format
 * @param date - Date string, Date object, or undefined
 * @param formatStr - Format string (default: 'MMM d, yyyy')
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(
  date: string | Date | undefined | null,
  formatStr: string = 'MMM d, yyyy'
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '';

  return format(dateObj, formatStr);
}

/**
 * Format a time
 * @param date - Date string, Date object, or undefined
 * @param formatStr - Format string (default: 'h:mm a')
 * @returns Formatted time string or empty string if invalid
 */
export function formatTime(
  date: string | Date | undefined | null,
  formatStr: string = 'h:mm a'
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '';

  return format(dateObj, formatStr);
}

/**
 * Format a date and time
 * @param date - Date string, Date object, or undefined
 * @param formatStr - Format string (default: 'MMM d, yyyy h:mm a')
 * @returns Formatted datetime string or empty string if invalid
 */
export function formatDateTime(
  date: string | Date | undefined | null,
  formatStr: string = 'MMM d, yyyy h:mm a'
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '';

  return format(dateObj, formatStr);
}

/**
 * Format a date relative to now
 * @param date - Date string, Date object, or undefined
 * @param addSuffix - Whether to add 'ago' or 'in' (default: true)
 * @returns Relative time string or empty string if invalid
 */
export function formatRelativeTime(
  date: string | Date | undefined | null,
  addSuffix: boolean = true
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '';

  return formatDistanceToNow(dateObj, { addSuffix });
}
