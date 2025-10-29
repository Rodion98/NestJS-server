import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './common/configs/config';

@Module({
  imports: [
    PrismaModule,
    ArticlesModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
