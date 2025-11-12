import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUser {
  @IsEmail({}, { message: 'Invalid email error!' })
  @IsNotEmpty({ message: 'Error, the email field cannot be empty.' })
  mail: string;

  @IsString({ message: 'Error, the field type must be string.' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @MaxLength(100, {
    message: 'Error: The maximum number of characters is 100.',
  })
  password: string;
}
