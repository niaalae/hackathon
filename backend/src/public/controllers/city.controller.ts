import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from '@/services/city.service';

@Controller('cities')
export class CityPublicController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(id);
  }
}
