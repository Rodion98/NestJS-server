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
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/640px-Typescript_logo_2020.svg.png',
             favicon: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Deepin_Icon_Theme_%E2%80%93_network-server_%286%29.svg',
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
