import { plainToClass } from 'class-transformer';
import { IsEmail, IsString, validateOrReject } from 'class-validator';
import { ValidationError } from '../../../modules/exceptions';

export class CheckEmailExistenceDto {
  @IsEmail()
  @IsString({ message: 'Avatar key should be a string' })
  email: string;

  static async validateAndReturn(body: Record<string, never>) {
    const bodyObject: CheckEmailExistenceDto = plainToClass(CheckEmailExistenceDto, body);

    try {
      await validateOrReject(bodyObject);

      return bodyObject;
    } catch (e) {
      throw new ValidationError(ValidationError.getClassValidatorValidationErrors(e));
    }
  }
}
