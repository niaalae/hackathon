import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCityDto } from '@/admin/dto/city/create-city.dto';
import { UpdateCityDto } from '@/admin/dto/city/update-city.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { getPrismaErrorCode } from '@/prisma/prisma-error.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class CityService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCityDto: CreateCityDto) {
    try {
      return await this.prismaService.city.create({
        data: {
          name_key: createCityDto.name_key,
          coords: createCityDto.coords as Prisma.InputJsonValue,
          images: createCityDto.images,
          region: { connect: { id: createCityDto.regionId } },
        },
      });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException('City with same name key already exists');
      throw e;
    }
  }

  findAll() {
    return this.prismaService.city.findMany();
  }

  findOne(id: string) {
    return this.prismaService.city.findUnique({ where: { id } });
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    try {
      return await this.prismaService.city.update({
        where: { id },
        data: {
          name_key: updateCityDto.name_key,
          coords: updateCityDto.coords as Prisma.InputJsonValue | undefined,
          images: updateCityDto.images,
          region: updateCityDto.regionId
            ? { connect: { id: updateCityDto.regionId } }
            : undefined,
        },
      });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException('City with same name key already exists');
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('City not found');
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.city.delete({ where: { id } });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('City not found');
      throw e;
    }
  }
}
