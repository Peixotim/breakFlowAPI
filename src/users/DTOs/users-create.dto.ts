import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UsersRoles } from '../entity/users.roles';

export class CreateUser {
  @IsEmail({}, { message: 'Invalid email error!' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @MaxLength(255, {
    message: 'Error: The maximum number of characters is 255.',
  })
  mail: string;

  @IsString({ message: 'Error, the type passed must be a string' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @MaxLength(100, {
    message: 'Error: The maximum number of characters is 100.',
  })
  password: string;

  @IsString({ message: 'Error, the type passed must be a string' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @MaxLength(11, {
    message: 'Error: The maximum number of characters is 100.',
  })
  cpf: string;

  @IsString({ message: 'Error, the type passed must be a string' })
  @MaxLength(255, {
    message: 'Error: The maximum number of characters is 255.',
  })
  name: string;

  @IsString({ message: 'Error, the type passed must be a string' })
  @IsOptional()
  avatarUrl: string;

  @IsEnum(UsersRoles, { message: 'Error, the type passed must be an enum!' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  role: UsersRoles;
}
