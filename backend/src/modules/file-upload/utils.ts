import { Options } from './types';

const DEFAULT_OPTIONS: Options = {
  maxFilesCount: 1,
  maxFileSize: 1024 * 1024, // 1mb
  allowedMediaTypes: ['images/jpeg', 'images/jpg', 'images/png'],
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
    allowedMediaTypes: options.allowedMediaTypes || DEFAULT_OPTIONS.allowedMediaTypes,
    maxFilesCount: options.maxFilesCount || DEFAULT_OPTIONS.maxFilesCount,
    maxFileSize: options.maxFileSize || DEFAULT_OPTIONS.maxFileSize,
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
