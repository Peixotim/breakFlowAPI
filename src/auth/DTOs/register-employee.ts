import {
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUser } from '../../users/DTOs/users-create.dto';
import { IsCnpj } from '../../core/validators/is-cnpj.validator';

export class RegisterEmployee {
  @ValidateNested()
  @Type(() => CreateUser)
  employee: CreateUser;

  @IsCnpj({ message: 'Error check the CNPJ entered!' })
  @IsNotEmpty({
    message: 'Error, the value of the cnpj variable cannot be empty!',
  })
  @IsString({ message: 'Error, the type passed must be a string' })
  @MaxLength(14, {
    message: 'Error: The CNPJ must contain exactly 14 characters.',
  })
  cnpj: string;
}
