// src/app.module.ts
import { Module } from '@nestjs/common';
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import AdminJS from 'adminjs'
import { PrismaService } from '../prisma/prisma.service.js'

AdminJS.registerAdapter({ Database, Resource })
const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

 const prisma = new PrismaService()

@Module({
  imports: [
   
       // AdminJS version 7 is ESM-only. In order to import it, you have to use dynamic imports.
       import('@adminjs/nestjs').then(({ AdminModule }) => AdminModule.createAdminAsync({
         useFactory: () => ({
           
           adminJsOptions: {
             rootPath: '/admin',
             resources: [
           {resource: { model: getModelByName('User'), client: prisma },},
            {resource: { model: getModelByName('Article'), client: prisma },}
             ],
           },
           auth: {
             authenticate,
             cookieName: 'adminjs',
             cookiePassword: 'secret'
           },
           sessionOptions: {
             resave: true,
             saveUninitialized: true,
             secret: 'secret'
           },
         }),
       })),
  ],
})
export class AdminModule {}
