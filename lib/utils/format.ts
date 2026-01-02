/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | undefined | null,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (amount === undefined || amount === null) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with commas
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumber(
  num: number | undefined | null,
  decimals: number = 0,
  locale: string = 'en-US'
): string {
  if (num === undefined || num === null) return '0';

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a number as a percentage
 * @param num - The number to format (0.5 = 50%)
 * @param decimals - Number of decimal places (default: 0)
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted percentage string
 */
export function formatPercentage(
  num: number | undefined | null,
  decimals: number = 0,
  locale: string = 'en-US'
): string {
  if (num === undefined || num === null) return '0%';

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format distance in miles
 * @param miles - Distance in miles
 * @returns Formatted distance string
 */
export function formatDistance(miles: number | undefined | null): string {
  if (miles === undefined || miles === null) return '0 mi';

  if (miles < 0.1) {
    return `${Math.round(miles * 5280)} ft`;
  }

  return `${miles.toFixed(1)} mi`;
}

/**
 * Format duration in minutes
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number | undefined | null): string {
  if (minutes === undefined || minutes === null) return '0 min';

  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (mins === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${mins} min`;
}
