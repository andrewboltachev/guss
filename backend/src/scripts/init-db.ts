import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../user.model';
import { hash } from 'bcrypt';
import { Round } from '../round.model';
import { UserRounds } from '../userrounds.model';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  // await User.destroy({ where: {} });
  //
  await User.sync();
  await Round.sync();
  await UserRounds.sync();

  const hashedPassword = await hash('admin123', 10);
  const newUser = await User.create({
    username: 'admin',
    password: hashedPassword,
  });

  console.log('Database seeded successfully.');

  await appContext.close();
}

bootstrap();
