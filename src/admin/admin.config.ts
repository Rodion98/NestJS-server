import AdminJS from 'adminjs';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

// Регистрируем адаптер ОДИН РАЗ
AdminJS.registerAdapter({ Database, Resource });

// Отдельный экземпляр PrismaService для AdminJS
const prisma = new PrismaService();

// 🔑 Экспортируем промис-модуль AdminJS для подключения в AppModule
export const AdminPanelModule = import('@adminjs/nestjs').then(({ AdminModule }) =>
  AdminModule.createAdminAsync({
    imports: [ConfigModule], // ✅ чтобы ConfigService был доступен
    inject: [ConfigService], // ✅ инжектим его в фабрику
    useFactory: async (configService: ConfigService) => {
      const ADMIN_EMAIL = configService.get<string>('ADMIN_EMAIL');
      const ADMIN_PASSWORD = configService.get<string>('ADMIN_PASSWORD');
      const ADMIN_COOKIE_SECRET = configService.get<string>('ADMIN_COOKIE_SECRET') || 'fallback_secret';

      const authenticate = async (email: string, password: string) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          return { email };
        }
        return null;
      };
return {
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            { resource: { model: getModelByName('User'), client: prisma } },
            { resource: { model: getModelByName('Article'), client: prisma } },
          ],
          branding: {
            companyName: 'TrainX Admin',
            logo: false,
            softwareBrothers: false,
          },
        },
        auth: {
          authenticate,
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
