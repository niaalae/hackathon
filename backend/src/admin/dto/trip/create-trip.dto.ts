import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsDateString()
  dateTime: string;

  @IsString()
  tripPolyline: string;

  @IsString()
  cityId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  placeIds?: string[];
}
