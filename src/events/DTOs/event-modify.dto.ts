import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class EventsModifyDTO {
  @IsString({ message: 'Error, the variable name must be of type string!' })
  @IsOptional()
  name: string;

  @IsNumber(
    {},
    { message: 'Error, the maxCapacity variable must be of type number' },
  )
  @Min(1, { message: 'Error, the minimum maximum capacity is 1' })
  @IsOptional()
  maxCapacity: number;

  @IsNumber(
    {},
    { message: 'Error, the durationLimit variable must be of type number !' },
  )
  @IsOptional()
  @Min(5, { message: 'The minimum duration limit is 5 !' })
  durationLimit: number;

  @IsString({
    message: 'Error, the variable colorTheme must be of type string!',
  })
  @IsOptional()
  colorTheme: string;
}
