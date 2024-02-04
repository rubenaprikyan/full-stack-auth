import { BaseError } from './BaseError';

export class UnsupportedMediaType extends BaseError {
  constructor(message) {
    super(message, 'Unsupported media type', 415);
  }
}
