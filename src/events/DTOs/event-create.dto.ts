import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class EventsCreateDTO {
  @IsString({ message: 'Error, the variable name must be of type string!' })
  @IsNotEmpty({ message: 'Error, the name variable cannot be empty !' })
  name: string;

  @IsNumber(
    {},
    { message: 'Error, the maxCapacity variable must be of type number' },
  )
  @IsNotEmpty({ message: 'Error, the maxCapacity variable cannot be empty !' })
  @Min(1, { message: 'Error, the minimum maximum capacity is 1' })
  maxCapacity: number;

  @IsNumber(
    {},
    { message: 'Error, the durationLimit variable must be of type number !' },
  )
  @IsNotEmpty({
    message: 'Error, the durationLimit variable cannot be empty !',
  })
  @Min(5, { message: 'The minimum duration limit is 5 !' })
  durationLimit: number;

  @IsString({
    message: 'Error, the variable colorTheme must be of type string!',
  })
  @IsOptional()
  colorTheme: string;
}
