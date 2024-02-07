import { BaseError } from './BaseError';

export class InternalServerError extends BaseError {
  constructor(details) {
    super(details, 'Internal Server Error', 500);
  }
}
