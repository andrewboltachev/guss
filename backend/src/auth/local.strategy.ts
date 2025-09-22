import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginOrRegisterDto } from '../login_or_register.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' });
  }

  async validate(loginOrRegisterDto: LoginOrRegisterDto): Promise<any> {
    const user = await this.authService.validateUser(loginOrRegisterDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
