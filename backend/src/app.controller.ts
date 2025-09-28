import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Round } from './round.model';
import {
  CreationAttributes,
  literal,
  Op,
  UniqueConstraintError,
} from 'sequelize';
import { addSecondsToDate } from './utils';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { UserRounds } from './userrounds.model';
import { User } from './user.model';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  me(@Req() req: Request) {
    const { username }: User = req.user as unknown as User;
    return { username };
  }

  // Post List
  @UseGuards(AuthGuard('jwt'))
  @Get('/active-rounds/')
  async getActiveRounds() {
    const rounds: Round[] = await Round.findAll({
      where: { endedAt: { [Op.gt]: new Date() } },
      order: [['startedAt', 'DESC']],
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

  // Post List
  @UseGuards(AuthGuard('jwt'))
  @Get('/all-rounds/')
  async getAllRounds() {
    const rounds: Round[] = await Round.findAll({
      order: [['startedAt', 'DESC']],
    });

    const currentDate = new Date().getTime();
    const results: Array<CreationAttributes<Round> & { status: string }> = [];
    for (const round of rounds) {
      let status = 'cooldown';
      if (round.startedAt.getTime() <= currentDate) {
        status = 'active';
      }
      if (round.endedAt.getTime() <= currentDate) {
        status = 'finished';
      }
      const item: CreationAttributes<Round> & { status: string } = {
        ...round.toJSON(),
        status,
      };
      results.push(item);
    }
    return results;
  }

  // Post List
  @UseGuards(AuthGuard('jwt'))
  @Get('/active-and-played-rounds/')
  async getActiveAndPlayedRounds() {
    const rounds: Round[] = await Round.findAll({
      where: {
        [Op.or]: [
          { endedAt: { [Op.gt]: new Date() } },
          { score: { [Op.gt]: 0 } },
        ],
      },
      order: [['startedAt', 'DESC']],
    });

    const currentDate = new Date().getTime();
    const results: Array<CreationAttributes<Round> & { status: string }> = [];
    for (const round of rounds) {
      let status = 'cooldown';
      if (round.startedAt.getTime() <= currentDate) {
        status = 'active';
      }
      if (round.endedAt.getTime() <= currentDate) {
        status = 'finished';
      }
      const item: CreationAttributes<Round> & { status: string } = {
        ...round.toJSON(),
        status,
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

  // Round Detail Page
  @UseGuards(AuthGuard('jwt'))
  @Get('/round/:id')
  async getRound(@Req() req: Request, @Param('id') id: string) {
    const round = await Round.findOne({ where: { id }, plain: true });
    const user: User = req.user as unknown as User;
    if (!round) {
      throw new NotFoundException();
    }
    const currentDate = new Date().getTime();
    let status: string = 'cooldown';
    if (currentDate >= round?.startedAt.getTime()) {
      status = 'active';
    }
    if (currentDate >= round?.endedAt.getTime()) {
      status = 'finished';
    }
    const extra: {
      status: string;
      score: number;
      totalScore?: number;
      bestScore?: number;
    } = { status, score: 0 };
    const userRounds = await UserRounds.findOne({
      where: { username: user.username, roundId: round.id },
    });
    if (userRounds) {
      extra.score = userRounds?.score;
    }
    if (status === 'finished') {
      extra.bestScore = await UserRounds.max('score', {
        where: {
          username: {
            [Op.ne]: 'nikita',
          },
          roundId: round.id,
        },
      });
      extra.bestScore ||= 0;
      extra.totalScore = await UserRounds.max('score', {
        where: {
          username: {
            [Op.ne]: 'nikita',
          },
          roundId: round.id,
        },
      });
      extra.totalScore ||= 0;
    }
    const data: CreationAttributes<Round> & {
      status: string;
      score: number;
      totalScore?: number;
      bestScore?: number;
    } = {
      ...round.toJSON(),
      ...extra,
    };

    return data;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/tap/:id')
  async tap(@Req() req: Request, @Param('id') id: string) {
    const round = await Round.findOne({
      where: { id },
      plain: true,
      attributes: ['startedAt', 'endedAt'],
    });
    if (!round) {
      throw new NotFoundException();
    }
    const currentDate = new Date().getTime();
    let outside = false;
    // секунда которая равна startedAt — в статусе active
    if (currentDate < round?.startedAt.getTime()) {
      throw new BadRequestException({ status: 'cooldown' });
    }
    // секунда которая равна endedAt — уже в статусе finished
    if (currentDate >= round?.endedAt.getTime()) {
      throw new BadRequestException({ status: 'finished' });
    }
    const user: User = req.user as unknown as User;

    const where = {
      username: user.username,
      roundId: id,
    };

    // Назначение этой переменной будет ясно дальше
    let needToUpdateScore: boolean = true;

    // Для начала пробуем самый короткий путь — если UserRounds уже создан
    // Здесь мы выполняем "атомарную" операцию hits = hits + 1
    // increment не подходит, т.к. static-метод increment всегда делает
    // RETURNING *, а нужно только количество
    const [affectedCount] = await UserRounds.update(
      {
        hits: literal('hits + 1'),
      },
      { where, silent: true },
    );
    console.log({ affectedCount });

    // [0][1] — affectedCount
    // affectedResult это (внутри Promise)
    // почему-то не [affectedRows: M[], affectedCount?: number]
    // а Array<[affectedRows: M[], affectedCount?: number]>
    // т.е. не заявленное значение, а целый массив таких
    if (!affectedCount) {
      // Если UserRecords не нашлось, нужно его создать
      try {
        const created = await UserRounds.create({
          ...where,
          hits: 1,
          score: 1,
        });
        needToUpdateScore = false;
        console.log({ created });
      } catch (e) {
        if (e instanceof UniqueConstraintError) {
          const parent = e.parent as unknown as {
            constraint: string;
            table: string;
          };
          if (parent.constraint === 'user_rounds_pkey') {
            // Коллизия — другой запрос уже создал UserRecords, поэтому снова
            // просто повторяем прибавление
            await UserRounds.increment(
              { hits: 1 },
              {
                where,
              },
            );
          } else {
            throw e;
          }
        } else {
          throw e;
        }
      }
    }
    if (needToUpdateScore) {
      // Идемпотентная операция обновления score
      await UserRounds.update(
        {
          score: literal('hits + floor(hits / 11) * 9'),
        },
        {
          where,
        },
      );
    }

    const { score } = (await UserRounds.findOne({
      where,
      attributes: ['score'],
    })) as UserRounds;
    return { score };
  }
}
