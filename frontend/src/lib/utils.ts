import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ERROR_MESSAGES = {
  FIELD_MAX_ERROR_MESSAGE: (field: string, max: number) =>
    `${field} should have maximum ${max} characters.`,
  FIELD_MIN_ERROR_MESSAGE: (field: string, min: number) =>
    `${field} should have at least ${min} characters.`,
  FIELD_IS_REQUIRED: (field: string) => `${field} is required.`,
  PASSWORD_MATCH_ERROR: 'Passwords do not match',
};
