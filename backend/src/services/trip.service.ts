import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTripDto } from '@/admin/dto/trip/create-trip.dto';
import { UpdateTripDto } from '@/admin/dto/trip/update-trip.dto';
import { getPrismaErrorCode } from '@/prisma/prisma-error.util';

@Injectable()
export class TripService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTripDto: CreateTripDto) {
    const { userIds, placeIds, ...tripData } = createTripDto;

    try {
      return await this.prismaService.trip.create({
        data: {
          ...tripData,
          dateTime: new Date(tripData.dateTime),
          tripUsers: userIds?.length
            ? {
                createMany: {
                  data: userIds.map((userId) => ({ userId })),
                },
              }
            : undefined,
          tripPlaces: placeIds?.length
            ? {
                createMany: {
                  data: placeIds.map((placeId, index) => ({ placeId, index })),
                },
              }
            : undefined,
        },
        include: { tripUsers: true, tripPlaces: true },
      });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException('Trip already exists');
      throw e;
    }
  }

  findAll() {
    return this.prismaService.trip.findMany({
      include: { tripUsers: true, tripPlaces: true },
    });
  }

  findOne(id: string) {
    return this.prismaService.trip.findUnique({
      where: { id },
      include: { tripUsers: true, tripPlaces: true },
    });
  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    const { userIds, placeIds, ...tripData } = updateTripDto;

    try {
      return await this.prismaService.$transaction(async (tx) => {
        if (userIds) {
          await tx.tripUser.deleteMany({ where: { tripId: id } });
          if (userIds.length) {
            await tx.tripUser.createMany({
              data: userIds.map((userId) => ({ tripId: id, userId })),
            });
          }
        }

        if (placeIds) {
          await tx.tripPlaces.deleteMany({ where: { tripId: id } });
          if (placeIds.length) {
            await tx.tripPlaces.createMany({
              data: placeIds.map((placeId, index) => ({ tripId: id, placeId, index })),
            });
          }
        }

        return tx.trip.update({
          where: { id },
          data: {
            ...tripData,
            dateTime: tripData.dateTime ? new Date(tripData.dateTime) : undefined,
          },
          include: { tripUsers: true, tripPlaces: true },
        });
      });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2002')
        throw new ConflictException('Trip already exists');
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('Trip not found');
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.trip.delete({ where: { id } });
    } catch (e) {
      if (getPrismaErrorCode(e) === 'P2025')
        throw new NotFoundException('Trip not found');
      throw e;
    }
  }

  async addUser(tripId: string, userId: string) {
    return this.prismaService.tripUser.create({ data: { tripId, userId } });
  }

  async removeUser(tripId: string, userId: string) {
    return this.prismaService.tripUser.delete({
      where: { tripId_userId: { tripId, userId } },
    });
  }
}
