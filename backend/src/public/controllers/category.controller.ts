import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from '@/services/category.service';

@Controller('categories')
export class CategoryPublicController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
