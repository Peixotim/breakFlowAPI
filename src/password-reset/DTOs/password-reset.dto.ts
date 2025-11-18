import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class PasswordResetDTO {
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @IsString({ message: 'Error, the type passed must be a string' })
  @MaxLength(100, {
    message: 'Error: The maximum number of characters is 100.',
  })
  password: string;

  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @IsString({ message: 'Error, the type passed must be a string' })
  token: string;
}
