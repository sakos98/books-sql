import { Injectable } from '@nestjs/common';
import { RegisterDTO } from 'src/authors/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) { }

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
}
