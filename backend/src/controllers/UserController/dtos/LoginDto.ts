import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  validateOrReject,
} from 'class-validator';
import { plainToClass, Type } from 'class-transformer';
import { ValidationError } from '../../../modules/exceptions';

export class UserCreationAttributes {
  @IsString()
  @MinLength(3, { message: 'First Name should have at least 2 characters' })
  @MaxLength(20, { message: 'First Name should have at most 25 characters' })
  firstName: string;

  @IsString()
  @MinLength(3, { message: 'Last Name should have at least 2 characters' })
  @MaxLength(20, { message: 'Last Name should have at most 25 characters' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password should have at least 6 characters' })
  @MaxLength(50, { message: 'Password should have at most 50 characters' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one numeric digit' })
  password: string;
}

export class PhotoCreationAttributes {
  @IsString()
  @MinLength(1, { message: 'Name should not be empty' })
  name: string;

  @IsString()
  @MinLength(1, { message: 'Key should not be empty' })
  key: string;
}

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
