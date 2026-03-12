import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Type(() => Number)
  value: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  placeId: string;

  @IsString()
  userId: string;
}
