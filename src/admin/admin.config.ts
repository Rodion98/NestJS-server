// src/admin/admin.config.ts
import AdminJS, { type CurrentAdmin } from 'adminjs';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminAuthService } from './admin-auth.service.js';

AdminJS.registerAdapter({ Database, Resource });

export const AdminPanelModule = import('@adminjs/nestjs').then(({ AdminModule }) =>
  AdminModule.createAdminAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const prisma = new PrismaService();
      const adminAuth = new AdminAuthService(prisma, configService);

      const ADMIN_COOKIE_SECRET =
        configService.get<string>('ADMIN_COOKIE_SECRET') ?? 'change-me';

      return {
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            { resource: { model: getModelByName('User'), client: prisma } },
            { resource: { model: getModelByName('Article'), client: prisma } },
          ],
          branding: {
            companyName: 'Admin Panel',
            logo: '/static/images/logo.png',
            favicon: '/static/images/favicon.svg',
            theme: {
                  colors: {
                   primary100: '#007bff',
                   primary80: '#339cff',
                   primary60: '#66baff',
                   primary40: '#99d4ff',
                   primary20: '#ccecff',
                 },
  },
            softwareBrothers: false,
          },
        },
        auth: {
          // Явно типизируем, что возвращаем CurrentAdmin | null
          authenticate: (
            email: string,
            password: string,
          ): Promise<CurrentAdmin | null> => {
            return adminAuth.validateAdmin(email, password);
          },
          cookieName: 'adminjs',
          cookiePassword: ADMIN_COOKIE_SECRET,
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: ADMIN_COOKIE_SECRET,
        },
      };
    },
  }),
);
