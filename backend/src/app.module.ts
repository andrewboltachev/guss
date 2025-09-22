import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Hit } from './hit.model';
import { Round } from './round.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgresql',
      host: 'localhost',
      port: 5432,
      username: 'guss',
      password: 'guss',
      database: 'guss',
      models: [User, Round, Hit],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
