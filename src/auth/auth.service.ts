import { Injectable } from '@nestjs/common';
import { RegisterDTO } from 'src/authors/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(registrationData: RegisterDTO) {
    try {
      const hashedPassword = await bcrypt.hash(registrationData.password, 10);
      const userData = {
        email: registrationData.email,
      };
      return this.userService.create(userData.email, hashedPassword);
    } catch (error) {
      // Obsługa błędów
      throw error;
    }
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (user && (await bcrypt.compare(password, user.password.hashedPassword))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async createSession(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'xrwe4543534',
      expiresIn: '12h',
    });
  
    return {
      access_token: accessToken,
    };
  }
}
