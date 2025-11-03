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
    expiresIn: '15m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
