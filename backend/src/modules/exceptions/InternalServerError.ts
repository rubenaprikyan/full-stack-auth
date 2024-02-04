import { BaseError } from './BaseError';

export class InternalServerError extends BaseError {
  constructor(message) {
    super(message, 'Internal Server Error', 500);
  }
}
