import { BaseError } from './BaseError';

export class BadRequest extends BaseError {
  constructor(details) {
    super(details, 'Bad Request', 400);
  }
}
