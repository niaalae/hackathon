import { Controller, Get, Param } from '@nestjs/common';
import { PlaceService } from '@/services/place.service';

@Controller('places')
export class PlacePublicController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  findAll() {
    return this.placeService.findAll();
  }

  @Get('recommendations/:userId')
  findRecommendations(@Param('userId') userId: string) {
    return this.placeService.findRecommendedForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }
}
