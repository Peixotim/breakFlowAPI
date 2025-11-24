import { IsNotEmpty, IsString } from 'class-validator';

export class SquadRegister {
  @IsString({ message: 'Error the type must be string' })
  @IsNotEmpty({})
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
