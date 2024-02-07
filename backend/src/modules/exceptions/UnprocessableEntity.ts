import { BaseError } from './BaseError';

export class UnprocessableEntity extends BaseError {
  constructor(details) {
    // used "unprocessable entity" status code
    super(details, 'Unprocessable Entity', 422);
  }
}
