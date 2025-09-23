import {
  Controller,
  ForbiddenException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from './user.model';
import { Round } from './round.model';
import { CreationAttributes, Op, UUIDV4 } from 'sequelize';
import { addSecondsToDate } from './utils';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  // test endpoint
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello(@Req() req: Request): string {
    // The user object is attached to the request by the AuthGuard
    const user = req.user as User;

    // Example: Use the user's email from the payload
    // Note: The structure of the user object depends on your JwtStrategy's validate method
    return `Hello, world! You are logged in as: ${user.username}!`;
  }

  // Post List
  @Get('/active-rounds/')
  async getActiveRounds() {
    const roundDuration: number = this.configService.get<number>(
      'ROUND_DURATION',
    ) as number;
    const cooldownDuration: number = this.configService.get<number>(
      'COOLDOWN_DURATION',
    ) as number;

    const currentDate = new Date();

    const activeDate = addSecondsToDate(currentDate, -roundDuration);

    const earliestDate = addSecondsToDate(activeDate, -cooldownDuration);

    const rounds: Round[] = await Round.findAll({
      where: { createdAt: { [Op.gte]: earliestDate } },
      plain: true,
    });

    const results: Array<CreationAttributes<Round> & { status: string }> = [];
    for (const round of rounds) {
      const isActive = round.createdAt >= activeDate;
      const status = isActive ? 'active' : 'cooldown';
      results.push({ ...round, status });
    }
    return results;
  }

  // Post List
  @Get('/active-rounds/')
  async createRound(@Req() req: Request) {
    if (req.user?.username !== 'admin') throw new ForbiddenException();
    const round = await Round.create({ id: UUIDV4() });
    return { id: round.id };
  }
}
