import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '@/admin/dto/user/create-user.dto';
import { UpdateUserDto } from '@/admin/dto/user/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { getPrismaErrorCode } from '@/prisma/prisma-error.util';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  private async saveUserPreferencesEmbedding(
    userId: string,
    preferences?: string,
  ) {
    const embedding = await this.embeddingService.embedText(preferences);

    if (!embedding) {
      await this.prismaService.$executeRaw`
        UPDATE "User"
        SET "preferences_embedding" = NULL
        WHERE "id" = ${userId}
      `;
      return;
    }

    await this.prismaService.$executeRaw`
      UPDATE "User"
      SET "preferences_embedding" = ${this.embeddingService.toVectorLiteral(embedding)}::vector
      WHERE "id" = ${userId}
    `;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 12),
        },
        omit: { password: true },
      });

      await this.saveUserPreferencesEmbedding(user.id, createUserDto.preferences);

      return user;
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException(
          'A user with the same email is already registered',
        );
      throw e;
    }
  }

  async findAll() {
    return this.prismaService.user.findMany({ omit: { password: true } });
  }

  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: updateUserDto.password
            ? await bcrypt.hash(updateUserDto.password, 12)
            : undefined,
        },
        omit: { password: true },
      });

      if (updateUserDto.preferences !== undefined) {
        await this.saveUserPreferencesEmbedding(user.id, updateUserDto.preferences);
      }

      return user;
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException(
          'A user with the same email is already registered',
        );
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('User not found');
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.user.delete({
        where: { id },
        omit: { password: true },
      });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('User not found');
      throw e;
    }
  }

  async applyPlaceFeedback(userId: string, placeId: string, liked: boolean) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const place = await this.prismaService.place.findUnique({
      where: { id: placeId },
      select: { id: true, name_key: true },
    });
    if (!place) throw new NotFoundException('Place not found');

    const placeEmbedding = await this.embeddingService.embedText(place.name_key);
    if (placeEmbedding) {
      await this.prismaService.$executeRaw`
        UPDATE "Place"
        SET "name_embedding" = ${this.embeddingService.toVectorLiteral(placeEmbedding)}::vector
        WHERE "id" = ${place.id}
      `;
    }

    const updatedRows = await this.prismaService.$queryRaw<Array<{ id: string }>>`
      UPDATE "User" u
      SET "preferences_embedding" = CASE
        WHEN p."name_embedding" IS NULL THEN u."preferences_embedding"
        WHEN u."preferences_embedding" IS NULL AND ${liked} THEN p."name_embedding"
        WHEN u."preferences_embedding" IS NULL AND NOT ${liked} THEN (p."name_embedding" * -1)
        WHEN ${liked} THEN ((u."preferences_embedding" * 0.85) + (p."name_embedding" * 0.15))
        ELSE ((u."preferences_embedding" * 0.85) - (p."name_embedding" * 0.15))
      END
      FROM "Place" p
      WHERE u."id" = ${userId}
        AND p."id" = ${placeId}
      RETURNING u."id"
    `;

    return {
      userId,
      placeId,
      liked,
      updated: updatedRows.length > 0,
    };
  }

  async resetUserVector(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.prismaService.$executeRaw`
      UPDATE "User"
      SET "preferences_embedding" = NULL
      WHERE "id" = ${userId}
    `;

    return { userId, reset: true };
  }
}
