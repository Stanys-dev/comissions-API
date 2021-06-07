import {
  IsDateString,
  IsNumber,
  IsString,
  IsUppercase,
  Length,
} from 'class-validator';

export class GetDto {
  @IsDateString()
  date: Date;

  @IsString()
  amount: string;

  @IsString()
  @Length(3, 3, { message: 'currency must be equal to 3 characters' })
  @IsUppercase()
  currency: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  client_id: number;
}
