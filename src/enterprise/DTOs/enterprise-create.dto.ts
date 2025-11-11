import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEmail,
  Length,
} from 'class-validator';
import { IsCnpj } from 'src/core/validators/is-cnpj.validator';

export class EnterpriseCreate {
  @IsString({ message: 'Error: The type passed must be string.¬' })
  @IsNotEmpty({ message: 'Error: The string cannot be empty.' })
  @MaxLength(255, {
    message: 'Error: The maximum number of characters is 255.',
  })
  companyName: string;

  @IsString({ message: 'Error: The type passed must be string.¬' })
  @IsNotEmpty({ message: 'Error: The string cannot be empty.' })
  @MaxLength(255, {
    message: 'Error: The maximum number of characters is 255.',
  })
  @IsOptional()
  fantasyName: string;

  @IsString({ message: 'Error: The type passed must be string.¬' })
  @IsNotEmpty({ message: 'Error: The string cannot be empty.' })
  @Length(14, 14, {
    message: 'Error: The CNPJ must contain exactly 14 characters.',
  })
  @IsCnpj({ message: 'The CNPJ entered is mathematically invalid.' })
  cnpj: string;

  @IsInt({ message: 'Error: The number must be of integer type.' })
  numberOfEmployees: number;

  @IsInt({ message: 'Error: The number must be of integer type.' })
  numberOfSectors: number;

  @IsEmail({}, { message: 'Error: The email address provided is invalid.' })
  @MaxLength(255, {
    message: 'Error: The maximum number of characters is 255.',
  })
  @IsOptional()
  contactMail: string;
}
