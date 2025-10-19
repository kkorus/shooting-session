import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
// todo: remove fastify adapter
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const expressAdapter = new ExpressAdapter();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, expressAdapter);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const port = 3000;
  await app.listen(port, '0.0.0.0');
  app.enableShutdownHooks();
}

bootstrap();
