import { BaseError } from './BaseError';

export class UnavailableServiceError extends BaseError {
  constructor(message) {
    // used "unprocessable entity" status code
    super(message, 'Unavailable Service', 503);
  }
}
