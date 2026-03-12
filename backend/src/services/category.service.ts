import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCategoryDto } from '@/admin/dto/category/create-category.dto';
import { UpdateCategoryDto } from '@/admin/dto/category/update-category.dto';
import { getPrismaErrorCode } from '@/prisma/prisma-error.util';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prismaService.category.create({ data: createCategoryDto });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException('Category key already exists');
      throw e;
    }
  }

  findAll() {
    return this.prismaService.category.findMany();
  }

  findOne(id: string) {
    return this.prismaService.category.findUnique({ where: { id } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prismaService.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException('Category key already exists');
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('Category not found');
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.category.delete({ where: { id } });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('Category not found');
      throw e;
    }
  }
}
