import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginOrRegisterDto } from '../login_or_register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginOrRegisterDto: LoginOrRegisterDto) {
    const userOrNull = await this.authService.validateUser(loginOrRegisterDto);

    if (!userOrNull) {
      throw new BadRequestException({ error: 'Invalid username or password' });
    }

    return userOrNull;
  }
}
