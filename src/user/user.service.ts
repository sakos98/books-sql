import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async getById(userId: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        password: true,
      },
    });
  }

  public async create(email: string, hashedPassword: string): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data: {
          email,
          password: {
            create: {
              hashedPassword,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
  

  async updateById(userId: string, email: string, password?: string): Promise<User> {
    let userDataToUpdate: { email: string; password?: { update: { hashedPassword: string } } } = { email };
    if (password) {
      userDataToUpdate.password = {
        update: {
          hashedPassword: password,
        },
      };
    }
    return await this.prismaService.user.update({
      where: { id: userId },
      data: userDataToUpdate,
    });
  }
  

  async deleteById(userId: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id: userId },
    });
  }
}
