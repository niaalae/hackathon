import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePlaceDto } from '@/admin/dto/place/create-place.dto';
import { UpdatePlaceDto } from '@/admin/dto/place/update-place.dto';
import { getPrismaErrorCode } from '@/prisma/prisma-error.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPlaceDto: CreatePlaceDto) {
    try {
      return await this.prismaService.place.create({
        data: {
          name_key: createPlaceDto.name_key,
          description_key: createPlaceDto.description_key,
          coords: createPlaceDto.coords as Prisma.InputJsonValue,
          images: createPlaceDto.images,
          video: createPlaceDto.video,
          tags: createPlaceDto.tags,
          entryFee: createPlaceDto.entryFee,
          openingHours: createPlaceDto.openingHours,
          city: { connect: { id: createPlaceDto.cityId } },
          category: { connect: { id: createPlaceDto.categoryId } },
        },
      });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException('Place key already exists');
      throw e;
    }
  }

  findAll() {
    return this.prismaService.place.findMany();
  }

  findOne(id: string) {
    return this.prismaService.place.findUnique({ where: { id } });
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    try {
      return await this.prismaService.place.update({
        where: { id },
        data: {
          name_key: updatePlaceDto.name_key,
          description_key: updatePlaceDto.description_key,
          coords: updatePlaceDto.coords as Prisma.InputJsonValue | undefined,
          images: updatePlaceDto.images,
          video: updatePlaceDto.video,
          tags: updatePlaceDto.tags,
          entryFee: updatePlaceDto.entryFee,
          openingHours: updatePlaceDto.openingHours,
          city: updatePlaceDto.cityId
            ? { connect: { id: updatePlaceDto.cityId } }
            : undefined,
          category: updatePlaceDto.categoryId
            ? { connect: { id: updatePlaceDto.categoryId } }
            : undefined,
        },
      });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException('Place key already exists');
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('Place not found');
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.place.delete({ where: { id } });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('Place not found');
      throw e;
    }
  }
}
