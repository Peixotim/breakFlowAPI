import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsEmail({}, { message: 'Invalid email error!' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @IsString({ message: 'Error, the type passed must be a string' })
  mail: string;
}
