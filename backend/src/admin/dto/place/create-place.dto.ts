import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  name_key: string;

  @IsString()
  description_key: string;

  @IsObject()
  coords: Record<string, unknown>;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  video: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNumber()
  @Type(() => Number)
  entryFee: number;

  @IsString()
  openingHours: string;

  @IsString()
  cityId: string;

  @IsString()
  categoryId: string;
}
