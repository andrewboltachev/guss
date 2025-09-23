import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Round } from './round.model';
import { CreationAttributes, Op } from 'sequelize';
import { addSecondsToDate } from './utils';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

/// <reference path="./express.d.ts" />

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  // Post List
  @UseGuards(AuthGuard('jwt'))
  @Get('/active-rounds/')
  async getActiveRounds() {
    const roundDuration: number = this.configService.get<number>(
      'ROUND_DURATION',
    ) as number;
    const cooldownDuration: number = this.configService.get<number>(
      'COOLDOWN_DURATION',
    ) as number;

    // createdAt ... cooldownDuration ... roundDuration

    const currentDate = new Date();
    const activeDate = addSecondsToDate(currentDate, -roundDuration);
    const earliestDate = addSecondsToDate(activeDate, -cooldownDuration);

    const rounds: Round[] = await Round.findAll({
      where: { createdAt: { [Op.gte]: earliestDate } },
    });

    const results: Array<CreationAttributes<Round> & { status: string }> = [];
    for (const roundObj of rounds) {
      const round: CreationAttributes<Round> = roundObj.toJSON();
      // Round starts after cooldownDuration has passed
      const startedAt = addSecondsToDate(
        round.createdAt as Date,
        cooldownDuration,
      );
      const isActive = startedAt <= earliestDate;
      const status = isActive ? 'active' : 'cooldown';
      results.push({ ...round, status });
    }
    return results;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add-round/')
  async addRound(@Req() req: Request) {
    // @ts-ignore // а то скрипт init-db не работает
    // if (req.user?.username !== 'admin') throw new ForbiddenException();
    const round = await Round.create({ id: v4() });
    return { id: round.id };
  }

  // Round Page
  @UseGuards(AuthGuard('jwt'))
  @Get('/round/:id')
  async getRound(@Req() req: Request) {
    // if (req.user?.username !== 'admin') throw new ForbiddenException();
    // const round = await Round.create({ id: UUIDV4() });
    // return { id: round.id };
  }
}
