import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
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
import { UserRounds } from './userrounds.model';
import { User } from './user.model';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  // Post List
  @UseGuards(AuthGuard('jwt'))
  @Get('/active-rounds/')
  async getActiveRounds() {
    const rounds: Round[] = await Round.findAll({
      where: { endedAt: { [Op.gt]: new Date() } },
    });

    const currentDate = new Date().getTime();
    const results: Array<CreationAttributes<Round> & { status: string }> = [];
    for (const round of rounds) {
      const isActive = round.startedAt.getTime() <= currentDate;
      const item: CreationAttributes<Round> & { status: string } = {
        ...round.toJSON(),
        status: isActive ? 'active' : 'cooldown',
      };
      results.push(item);
    }
    return results;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add-round/')
  async addRound(@Req() req: Request) {
    const user: User = req.user as unknown as User;
    if (user.username !== 'admin') {
      throw new ForbiddenException();
    }

    const roundDuration: number = this.configService.get<number>(
      'ROUND_DURATION',
    ) as number;
    const cooldownDuration: number = this.configService.get<number>(
      'COOLDOWN_DURATION',
    ) as number;

    // Хранение всех трёх дат (и определение их на этапе создания)
    // — большое упрощение
    const createdAt = new Date();
    const startedAt = addSecondsToDate(createdAt, cooldownDuration);
    const endedAt = addSecondsToDate(startedAt, roundDuration);

    const round = await Round.create({
      id: v4(),
      createdAt,
      startedAt,
      endedAt,
    });
    return { id: round.id };
  }

  // Round Page
  @UseGuards(AuthGuard('jwt'))
  @Get('/round/:id')
  async getRound(@Req() req: Request, id: string) {
    const round = await Round.findOne({ where: { id }, plain: true });
    const user: User = req.user as unknown as User;
    if (!round) {
      throw new NotFoundException();
    }
    const currentDate = new Date().getTime();
    if (currentDate > round?.endedAt.getTime()) {
      await UserRounds.findOne({
        where: { username: user.username },
      });
    }
    return {
      ...round,
    };
  }
}
