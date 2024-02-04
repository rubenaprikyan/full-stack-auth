import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  constructor(message) {
    // used "unprocessable entity" status code
    super(message, 'Validation Error', 422);
  }
}
