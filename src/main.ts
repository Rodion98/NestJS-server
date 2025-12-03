// src/main.ts

import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception.filter.js';
import { ConfigService } from '@nestjs/config';
import type { CorsConfig, NestConfig } from './common/configs/config.interface.js';
import * as express from 'express';
import { join } from 'path';
import { setupSwagger } from './swagger/swagger.config.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Раздаём всё содержимое public
  const publicPath = join(process.cwd(), 'public');
  app.use('/static', express.static(publicPath));

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Prisma Client Exception Filter for unhandled exceptions
  const httpAdapterHost = app.get(HttpAdapterHost);
  //   const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
  const isProd = nodeEnv === 'production';

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, isProd));

  setupSwagger(app, configService);

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000);
  console.log(`🚀 Server started on http://localhost:3000`);
  console.log(`📘 Swagger on   http://localhost:3000/api`);
  console.log(`📘 AdminJS on   http://localhost:3000/admin`);
}
bootstrap();
