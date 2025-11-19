import { IsOptional, IsString, MaxLength } from 'class-validator';
export class ModifyUserDTO {
  @IsString({ message: 'Error, the type passed must be a string' })
  @MaxLength(255, {
    message: 'Error: The maximum number of characters is 255.',
  })
  @IsOptional()
  name: string;

  @IsString({ message: 'Error, the type passed must be a string' })
  @IsOptional()
  avatarUrl: string;

  @IsString({ message: 'Error, the type passed must be a string' })
  @IsOptional()
  username: string;

  @IsString({ message: 'Error, the type passed must be a string' })
  @IsOptional()
  biography: string;
}
