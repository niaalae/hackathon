import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name_key: string;

  @IsString()
  description_key: string;
}
