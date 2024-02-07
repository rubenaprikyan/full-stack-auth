import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  constructor(details) {
    // used "unprocessable entity" status code
    super(details, 'Validation Error', 422);
  }
}
