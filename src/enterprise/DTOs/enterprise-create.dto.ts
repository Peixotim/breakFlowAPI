import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class EnterpriseCreate {
  @IsString({ message: 'Error: The type passed must be string.¬' })
  @IsNotEmpty({ message: 'Error: Company name cannot be empty.' })
  @MaxLength(255, {
    message: 'Error: The maximum number of characters is 255.',
  })
  companyName: string;
}
