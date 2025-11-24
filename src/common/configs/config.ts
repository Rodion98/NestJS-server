import type { Config } from './config.interface.js';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'First NestJS Server With Auth',
    description: 'The nestjs API description',
    version: '0.1',
    path: 'api',
  },
    security: {
    // если есть переменные окружения — берём их
    // если нет — используем дефолты
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    bcryptSaltOrRound: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  },
};

export default (): Config => config;
