import { Controller, Post, Body, ValidationPipe, BadRequestException, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/authors/dtos/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/register')
  async register(@Body(new ValidationPipe()) registerDTO: RegisterDTO): Promise<any> {
    if (registerDTO.password !== registerDTO.passwordRepeat) {
      throw new BadRequestException('Passwords do not match');
    }

    return this.authService.register(registerDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const tokens = await this.authService.createSession(req.user);
    res.cookie('auth', tokens, { httpOnly: true });
    res.send({
      message: 'success',
    });
  }
}
