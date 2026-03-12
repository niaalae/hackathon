import { Controller, Get, Param } from '@nestjs/common';
import { RegionService } from '@/services/region.service';

@Controller('regions')
export class RegionPublicController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  findAll() {
    return this.regionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }
}
