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

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 12),
        },
        omit: { password: true },
      });
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
      return await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: updateUserDto.password
            ? await bcrypt.hash(updateUserDto.password, 12)
            : undefined,
        },
        omit: { password: true },
      });
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
}
