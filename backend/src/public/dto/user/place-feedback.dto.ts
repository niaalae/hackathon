import { IsBoolean, IsString } from 'class-validator';

export class PlaceFeedbackDto {
  @IsString()
  placeId: string;

  @IsBoolean()
  liked: boolean;
}
