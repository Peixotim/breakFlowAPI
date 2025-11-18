import {
  IsString,
  Length,
  Matches,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class PasswordVerify {
  @IsString()
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos.' })
  @Matches(/^\d{6}$/, { message: 'O código deve conter apenas números.' })
  code: string;

  @IsEmail({}, { message: 'Invalid email error!' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @IsString({ message: 'Error, the type passed must be a string' })
  mail: string;
}
