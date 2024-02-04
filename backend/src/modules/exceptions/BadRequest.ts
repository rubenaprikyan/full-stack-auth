import { BaseError } from './BaseError';

export class BadRequest extends BaseError {
  constructor(message) {
    super(message, 'Bad Request', 400);
  }
}
