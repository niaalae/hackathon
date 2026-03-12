import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsDateString()
  dateTime: string;

  @IsOptional()
  @IsString()
  tripPolyline?: string;

  @IsOptional()
  @IsArray()
  @IsArray({ each: true })
  routeCoords?: number[][];

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
