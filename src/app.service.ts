import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World blog-backend-rest-api-nestjs-prisma!';
  }
}
