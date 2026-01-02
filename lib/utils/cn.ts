import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and merges Tailwind classes
 * This prevents class conflicts when extending component styles
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
