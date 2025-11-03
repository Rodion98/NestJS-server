// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { ArticlesModule } from './articles/articles.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminModule } from './admin/admin.module.js'

import { ConfigModule } from '@nestjs/config';
import config from './common/configs/config.js';


// import { Database, Resource, getModelByName } from '@adminjs/prisma'
// import AdminJS from 'adminjs'

// import { PrismaService } from './prisma/prisma.service.js'

// AdminJS.registerAdapter({ Database, Resource })
// const DEFAULT_ADMIN = {
//   email: 'admin@example.com',
//   password: 'password',
// }

// const authenticate = async (email: string, password: string) => {
//   if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
//     return Promise.resolve(DEFAULT_ADMIN)
//   }
//   return null
// }

//  const prisma = new PrismaService()

@Module({
  imports: [
    PrismaModule,
    ArticlesModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AdminModule

    // // AdminJS version 7 is ESM-only. In order to import it, you have to use dynamic imports.
    // import('@adminjs/nestjs').then(({ AdminModule }) => AdminModule.createAdminAsync({
    //   useFactory: () => ({
        
    //     adminJsOptions: {
    //       rootPath: '/admin',
    //       resources: [
    //     {resource: { model: getModelByName('User'), client: prisma },},
    //      {resource: { model: getModelByName('Article'), client: prisma },}
    //       ],
    //     },
    //     auth: {
    //       authenticate,
    //       cookieName: 'adminjs',
    //       cookiePassword: 'secret'
    //     },
    //     sessionOptions: {
    //       resave: true,
    //       saveUninitialized: true,
    //       secret: 'secret'
    //     },
    //   }),
    // })),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
