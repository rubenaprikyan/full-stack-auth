import { BaseError } from './BaseError';
import { ValidationError as ClassValidatorValidationError } from 'class-validator';

export interface ReadableClassValidationError {
  key: string | ReadableClassValidationError[];
  details?: string;
}

export class ValidationError extends BaseError {
  constructor(details) {
    super(details, 'Validation Error', 400);
  }

  /**
   * static member of Validation error to get readable sanitized errors from class-validator
   * @param errors
   */
  public static getClassValidatorValidationErrors(
    errors: ClassValidatorValidationError[],
  ): (
    | {
        details: { [p: string]: string };
        key: string;
      }
    | { details: ReadableClassValidationError[]; key: string }
    | { key: string }
  )[] {
    return errors.map((validationError: ClassValidatorValidationError) => {
      const key = validationError.property;

      if (validationError.constraints) {
        return {
          key,
          details: validationError.constraints,
        };
      } else if (validationError.children) {
        return {
          key,
          details: ValidationError.getClassValidatorValidationErrors(
            validationError.children,
          ),
        };
      } else {
        return { key };
      }
    });
  }
}
