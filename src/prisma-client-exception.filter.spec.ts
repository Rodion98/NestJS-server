import { PrismaClientExceptionFilter } from './prisma-client-exception.filter.js';

describe('PrismaClientExceptionFilter', () => {
  it('should be defined', () => {
    expect(new PrismaClientExceptionFilter()).toBeDefined();
  });
});
