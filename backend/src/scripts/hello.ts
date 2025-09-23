import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../user.model';
import { UserRounds } from '../userrounds.model';
import { UniqueConstraintError } from 'sequelize';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const existingUser = await User.findOne({ where: { username: 'admin' } });
  if (existingUser) {
    console.log({ existingUser });
  } else {
    console.log('User does not exist');
  }
  console.log('Hello world.');
  try {
    await UserRounds.create({
      username: 'foo',
      roundId: 'a05f177d-2e91-4086-ba6f-e6148e9d0d8a',
    });
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      const parent = e.parent as unknown as {
        constraint: string;
        table: string;
      };
      console.error(parent.constraint === 'user_rounds_pkey');
    }
  }

  await appContext.close();
}

bootstrap();
