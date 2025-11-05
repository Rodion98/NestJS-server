// src/admin/admin-auth.service.ts
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';
import type { CurrentAdmin } from 'adminjs';
import bcrypt from 'bcrypt';

export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<CurrentAdmin | null> {
    // 1) Пробуем найти пользователя в базе
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Проверяем роль
      if (user.role !== 'ADMIN') {
        return null;
      }

      // Проверяем пароль (user.password — хэш)
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return null;
      }

      // Приводим id к строке — так хочет CurrentAdmin
      const adminFromDb: CurrentAdmin = {
        id: String(user.id),
        email: user.email,
        // кастомные поля можно добавлять свободно
        role: user.role,
        name: user.firstName ?? undefined,

        source: 'database',
      };

      return adminFromDb;
    }

    // 2) Если в БД не нашли — пробуем env-админа (fallback)
    const envEmail = this.config.get<string>('ADMIN_EMAIL');
    const envPassword = this.config.get<string>('ADMIN_PASSWORD');

    if (email === envEmail && password === envPassword) {
      const envAdmin: CurrentAdmin = {
        id: 'env-admin', // фиксированная строка, главное — string
        email,
        role: 'SUPER_ADMIN',
        source: 'env',
      };

      return envAdmin;
    }

    // 3) Иначе не пускаем
    return null;
  }
}
