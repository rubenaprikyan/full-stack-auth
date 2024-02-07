import { BaseError } from './BaseError';

export class UnavailableServiceError extends BaseError {
  constructor(details) {
    super(details, 'Unavailable Service', 503);
  }
}
