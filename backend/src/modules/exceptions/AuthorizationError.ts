import { BaseError } from './BaseError';

export class AuthorizationError extends BaseError {
  constructor(message) {
    super(message, 'Unauthorized', 401);
  }
}
