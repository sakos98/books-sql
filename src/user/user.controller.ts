import { Controller, Get, Param, NotFoundException, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.userService.getById(id)))
      throw new NotFoundException('User not found');
    await this.userService.deleteById(id);
    return { success: true };
  }
}

