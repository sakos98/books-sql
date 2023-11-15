import { Controller, Post, Body, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/authors/dtos/create-user.dto';

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
}
