import { IsString } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  name_key: string;
}
