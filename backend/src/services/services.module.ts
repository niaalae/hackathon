import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CityService } from './city.service';
import { RegionService } from './region.service';
import { CategoryService } from './category.service';
import { PlaceService } from './place.service';
import { RatingService } from './rating.service';
import { TripService } from './trip.service';
import { EmbeddingService } from './embedding.service';
import { HeroAgentService } from './hero-agent.service';

const services = [
  UserService,
  CityService,
  RegionService,
  CategoryService,
  PlaceService,
  RatingService,
  TripService,
  EmbeddingService,
  HeroAgentService,
];

@Module({
  providers: services,
  exports: services,
})
export class ServicesModule {}
