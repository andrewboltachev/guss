import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'http://127.0.0.1:5173', // 👈 Your Vite/React development server
      'http://localhost:5173', // 👈 Include localhost too, just in case
      'http://127.0.0.1:5174', // 👈 Your Vite/React development server
      'http://localhost:5174', // 👈 Include localhost too, just in case
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 👈 IMPORTANT: Required for cookies/JWT in cookies
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
