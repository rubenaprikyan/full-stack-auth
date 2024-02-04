import { Options } from './types';

const DEFAULT_OPTIONS: Options = {
  fileCount: 1,
  fileSize: 1024 * 1024, // 1mb
  allowedTypes: ['images/jpeg', 'images/jpg', 'images/png'],
};

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * function createOptions
 * returns a new options with default values fulfillment
 * @param {Options} options
 * @returns {Options} options
 */
export function createOptions(options: Options): Options {
  return {
    allowedTypes: options.allowedTypes || DEFAULT_OPTIONS.allowedTypes,
    fileCount: options.fileCount || DEFAULT_OPTIONS.fileCount,
    fileSize: options.fileSize || DEFAULT_OPTIONS.fileSize,
  };
}

/**
 * Utility function for dev logs management
 * @param {any[]} msg - message
 */
export function invariant(...msg: unknown[]) {
  if (isDevelopment) {
    console.log(...msg);
  }
}
