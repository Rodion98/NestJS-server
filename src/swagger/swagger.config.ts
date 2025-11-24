// src/swagger/swagger.config.ts
import type { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { ConfigService } from '@nestjs/config';
import type { SwaggerConfig } from '../common/configs/config.interface.js';

export function setupSwagger(app: INestApplication, configService: ConfigService) {
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  if (!swaggerConfig?.enabled) return;

  const options = new DocumentBuilder()
    .setTitle(swaggerConfig.title || 'Nestjs')
    .setDescription(
      swaggerConfig.description || 'The nestjs API description',
    )
    .setVersion(swaggerConfig.version || '1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const swaggerPath = swaggerConfig.path || 'api';

  SwaggerModule.setup(swaggerPath, app, document, {
    customJs: '/static/swagger-custom.js',
    customCssUrl: '/static/swagger-custom.css',
  });

  console.log(`📘 Swagger on   http://localhost:3000/${swaggerPath}`);

}
