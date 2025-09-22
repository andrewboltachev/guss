// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user.model';
import { hash, compare } from 'bcrypt';
import { LoginOrRegisterDto } from '../login_or_register.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    loginOrRegisterDto: LoginOrRegisterDto,
  ): Promise<User | null> {
    const { username, password: pass } = loginOrRegisterDto;
    const user: User | null = await this.userModel.findOne({
      where: { username },
    });
    if (!user) {
      return await this.userModel.create({
        username,
        password: await hash(pass, 10),
      });
    } else {
      if (await compare(pass, user.password)) {
        return user;
      } else {
        return null;
      }
    }
  }

  login(user: User) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
      }),
    };
  }
}
