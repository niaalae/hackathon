import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import polyline from '@mapbox/polyline';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTripDto } from '@/admin/dto/trip/create-trip.dto';
import { UpdateTripDto } from '@/admin/dto/trip/update-trip.dto';
import { getPrismaErrorCode } from '@/prisma/prisma-error.util';

@Injectable()
export class TripService {
  constructor(private readonly prismaService: PrismaService) {}

  private readCoordTuple(value: unknown): [number, number] | null {
    if (Array.isArray(value) && value.length >= 2) {
      const first = Number(value[0]);
      const second = Number(value[1]);
      if (Number.isFinite(first) && Number.isFinite(second)) {
        return [first, second];
      }
    }

    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const lat = Number(record.lat ?? record.latitude);
      const lng = Number(record.lng ?? record.lon ?? record.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return [lat, lng];
      }
    }

    return null;
  }

  private async routeFromOsrm(latLngPoints: [number, number][]) {
    const osrmPath = latLngPoints
      .map(([lat, lng]) => `${lng},${lat}`)
      .join(';');

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${osrmPath}?overview=full&geometries=geojson`,
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      routes?: Array<{ geometry?: { coordinates?: number[][] } }>;
    };
    const coordinates = payload.routes?.[0]?.geometry?.coordinates;

    if (!coordinates?.length) return null;

    return coordinates
      .map((pair) => {
        const lng = Number(pair[0]);
        const lat = Number(pair[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return [lat, lng] as [number, number];
      })
      .filter((point): point is [number, number] => point !== null);
  }

  private async collectTripPoints(
    placeIds?: string[],
    routeCoords?: number[][],
  ): Promise<[number, number][]> {
    if (routeCoords?.length) {
      return routeCoords
        .map((coord) => this.readCoordTuple(coord))
        .filter((point): point is [number, number] => point !== null);
    }

    if (!placeIds?.length) return [];

    const places = await this.prismaService.place.findMany({
      where: { id: { in: placeIds } },
      select: { id: true, coords: true },
    });

    const coordByPlace = new Map(
      places
        .map((place) => [place.id, this.readCoordTuple(place.coords)] as const)
        .filter((item): item is readonly [string, [number, number]] => item[1] !== null),
    );

    return placeIds
      .map((placeId) => coordByPlace.get(placeId) ?? null)
      .filter((point): point is [number, number] => point !== null);
  }

  private async resolveTripPolyline(
    placeIds?: string[],
    routeCoords?: number[][],
    fallbackTripPolyline?: string,
  ): Promise<string | undefined> {
    const points = await this.collectTripPoints(placeIds, routeCoords);

    if (points.length < 2) return fallbackTripPolyline;

    const routedPoints = await this.routeFromOsrm(points);
    const routeToEncode = routedPoints?.length ? routedPoints : points;

    return polyline.encode(routeToEncode);
  }

  async create(createTripDto: CreateTripDto) {
    const { userIds, placeIds, routeCoords, ...tripData } = createTripDto;
    const tripPolyline = await this.resolveTripPolyline(
      placeIds,
      routeCoords,
      tripData.tripPolyline,
    );

    try {
      return await this.prismaService.trip.create({
        data: {
          ...tripData,
          tripPolyline: tripPolyline ?? '',
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
    const { userIds, placeIds, routeCoords, ...tripData } = updateTripDto;

    const tripPolyline = await this.resolveTripPolyline(
      placeIds,
      routeCoords,
      tripData.tripPolyline,
    );

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
            tripPolyline,
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
