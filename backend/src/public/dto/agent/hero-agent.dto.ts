import { IsString, MinLength } from 'class-validator';

export class HeroAgentDto {
  @IsString()
  @MinLength(3)
  prompt: string;
}
