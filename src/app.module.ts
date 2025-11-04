import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { ArticlesModule } from './articles/articles.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminPanelModule } from './admin/admin.config.js';

import { ConfigModule } from '@nestjs/config';
import config from './common/configs/config.js';

@Module({
  imports: [
    PrismaModule,
    ArticlesModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AdminPanelModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
