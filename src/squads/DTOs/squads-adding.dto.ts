import { IsNotEmpty, IsEmail } from 'class-validator';
export class SquadsAdding {
  @IsEmail({}, { message: 'The field $property must be a email' })
  @IsNotEmpty({
    message: 'The field $property is required and cannot be empty',
  })
  mail: string;
}
