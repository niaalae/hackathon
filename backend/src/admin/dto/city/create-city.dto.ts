import { IsArray, IsObject, IsString } from 'class-validator';

export class CreateCityDto {
	@IsString()
	name_key: string;

	@IsObject()
	coords: Record<string, unknown>;

	@IsArray()
	@IsString({ each: true })
	images: string[];

	@IsString()
	regionId: string;
}
