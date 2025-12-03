import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserNotFoundError } from '../common/errors/for_route/users.errors.js';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findByEmail(email: string) {
    const user = this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateRefreshTokenHash(userId: number, refreshTokenHash: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: refreshTokenHash,
      },
    });
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async changePassword(userId: number, newHashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null, password: newHashedPassword },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // if (updateUserDto.password) {
    //   updateUserDto.password = await bcrypt.hash(
    //     updateUserDto.password,
    //     roundsOfHashing,
    //   );
    // }
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
