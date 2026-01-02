import { parsePhoneNumber as parsePhone, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

/**
 * Format a phone number for display
 * @param phone - Phone number string
 * @param country - Country code (default: 'US')
 * @returns Formatted phone number or original if invalid
 */
export function formatPhoneNumber(
  phone: string | undefined | null,
  country: CountryCode = 'US'
): string {
  if (!phone) return '';

  try {
    const parsed = parsePhone(phone, country);
    if (parsed) {
      return parsed.formatNational();
    }
  } catch {
    // Return original if parsing fails
  }

  return phone;
}

/**
 * Parse a phone number to E.164 format for storage
 * @param phone - Phone number string
 * @param country - Country code (default: 'US')
 * @returns E.164 formatted phone number or null if invalid
 */
export function parsePhoneNumber(
  phone: string | undefined | null,
  country: CountryCode = 'US'
): string | null {
  if (!phone) return null;

  try {
    const parsed = parsePhone(phone, country);
    if (parsed && parsed.isValid()) {
      return parsed.format('E.164');
    }
  } catch {
    // Return null if parsing fails
  }

  return null;
}

/**
 * Check if a phone number is valid
 * @param phone - Phone number string
 * @param country - Country code (default: 'US')
 * @returns Whether the phone number is valid
 */
export function isValidPhone(
  phone: string | undefined | null,
  country: CountryCode = 'US'
): boolean {
  if (!phone) return false;

  try {
    return isValidPhoneNumber(phone, country);
  } catch {
    return false;
  }
}
