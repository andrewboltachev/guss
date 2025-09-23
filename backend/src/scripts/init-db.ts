import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../user.model';
import { hash } from 'bcrypt';
import { Round } from '../round.model';
import { UserRounds } from '../userrounds.model';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  //await User.sync();
  await Round.sync();
  await UserRounds.sync();

  const hashedPassword = await hash('admin123', 10);
  const existingAdmin = await User.findOne({ where: { username: 'admin' } });

  if (!existingAdmin) {
    console.log('Admin does not exist, creating');
    await User.create({
      username: 'admin',
      password: hashedPassword,
    });
  }

  console.log('Database seeded successfully.');

  await appContext.close();
}

bootstrap();
