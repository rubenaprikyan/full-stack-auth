import { BaseError } from './BaseError';

export class AuthorizationError extends BaseError {
  constructor(details) {
    super(details, 'Unauthorized', 401);
  }
}
