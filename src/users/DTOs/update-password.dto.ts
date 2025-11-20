import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdatePassword {
  @IsString({ message: 'Error, the type passed must be a string' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  @MaxLength(100, {
    message: 'Error: The maximum number of characters is 100.',
  })
  password: string;

  @IsString({ message: 'Error, the type passed must be a string' })
  @IsNotEmpty({ message: 'Error the value passed cannot be empty!' })
  uuid: string;
}
