import { IsString, IsEmail, validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationError } from '../../../modules/exceptions';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  password: string;

  static async validateAndReturn(body: Record<string, never>) {
    const bodyObject: LoginDto = plainToClass(LoginDto, body);

    try {
      await validateOrReject(bodyObject);

      return bodyObject;
    } catch (e) {
      throw new ValidationError(ValidationError.getClassValidatorValidationErrors(e));
    }
  }
}
