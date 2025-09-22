import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../user.model';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const existingUser = await User.findOne({ where: { username: 'admin' } });
  if (existingUser) {
    console.log({ existingUser });
  } else {
    console.log('User does not exist');
  }
  console.log('Hello world.');

  await appContext.close();
}

bootstrap();
