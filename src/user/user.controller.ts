import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<User> {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
