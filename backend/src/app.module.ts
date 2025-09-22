import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserRounds } from './userrounds.model';
import { Round } from './round.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5438,
      username: 'guss',
      password: 'guss',
      database: 'guss',
      models: [User, Round, UserRounds],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
