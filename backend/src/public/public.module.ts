import { Module } from '@nestjs/common';
import { ServicesModule } from '@/services/services.module';
import { RegionPublicController } from './controllers/region.controller';
import { CategoryPublicController } from './controllers/category.controller';
import { CityPublicController } from './controllers/city.controller';
import { PlacePublicController } from './controllers/place.controller';
import { TripPublicController } from './controllers/trip.controller';
import { RatingPublicController } from './controllers/rating.controller';

@Module({
  imports: [ServicesModule],
  controllers: [
    RegionPublicController,
    CategoryPublicController,
    CityPublicController,
    PlacePublicController,
    TripPublicController,
    RatingPublicController,
  ],
})
export class PublicModule {}
