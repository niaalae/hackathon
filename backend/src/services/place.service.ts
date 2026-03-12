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
import { EmbeddingService } from './embedding.service';

@Injectable()
export class PlaceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  private async savePlaceEmbedding(placeId: string, text?: string) {
    const embedding = await this.embeddingService.embedText(text);
    if (!embedding) return;

    await this.prismaService.$executeRaw`
      UPDATE "Place"
      SET "name_embedding" = ${this.embeddingService.toVectorLiteral(embedding)}::vector
      WHERE "id" = ${placeId}
    `;
  }

  async create(createPlaceDto: CreatePlaceDto) {
    try {
      const place = await this.prismaService.place.create({
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

      await this.savePlaceEmbedding(place.id, createPlaceDto.name_key);

      return place;
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
      const place = await this.prismaService.place.update({
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

      if (updatePlaceDto.name_key !== undefined) {
        await this.savePlaceEmbedding(place.id, updatePlaceDto.name_key);
      }

      return place;
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

  async findRecommendedForUser(userId: string, limit = 10) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const rows = await this.prismaService.$queryRaw<
      Array<Record<string, unknown>>
    >`
      SELECT
        p.*,
        COALESCE(AVG(r.value), 0)::float AS "avgRating",
        (p."name_embedding" <=> u."preferences_embedding")::float AS "distance"
      FROM "Place" p
      JOIN "User" u ON u.id = ${userId}
      LEFT JOIN "Rating" r ON r."placeId" = p.id
      WHERE u."preferences_embedding" IS NOT NULL
        AND p."name_embedding" IS NOT NULL
      GROUP BY p.id, u."preferences_embedding"
      ORDER BY "distance" ASC, "avgRating" DESC
      LIMIT ${limit}
    `;

    return rows;
  }
}
