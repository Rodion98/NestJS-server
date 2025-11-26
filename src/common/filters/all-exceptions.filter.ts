import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';
import { Prisma } from '@prisma/client';

import { AppError } from '../errors/app-error.js';
import { ErrorResponse } from '../errors/error-response.interface.js';
import { mapAppError } from '../errors/mappers/app-error.mapper.js';
import { mapHttpException } from '../errors/mappers/http-exception.mapper.js';
import { mapPrismaError } from '../errors/mappers/prisma-error.mapper.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly isProd: boolean,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: ErrorResponse;

    // 1) AppError — наши доменные ошибки
    if (exception instanceof AppError) {
      const result = mapAppError(exception);
      httpStatus = result.httpStatus;
      body = result.body;

      this.addDevFields(body, httpAdapter, request, exception);
      this.logException(exception, body);
      return httpAdapter.reply(response, body, httpStatus);
    }

    // 2) HttpException (NotFound, Forbidden, ValidationPipe и т.п.)
    if (exception instanceof HttpException) {
      const result = mapHttpException(exception);
      httpStatus = result.httpStatus;
      body = result.body;

      this.addDevFields(body, httpAdapter, request, exception);
      this.logException(exception, body);
      return httpAdapter.reply(response, body, httpStatus);
    }

    // 3) Prisma ошибки
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const result = mapPrismaError(exception);
      httpStatus = result.httpStatus;
      body = result.body;

      this.addDevFields(body, httpAdapter, request, exception);
      this.logException(exception, body);
      return httpAdapter.reply(response, body, httpStatus);
    }

    // 4) Любая другая ошибка — 500
    body = {
      statusCode: httpStatus,
      code: 'INTERNAL.SERVER_ERROR',
      message: 'Internal server error',
      error: (exception as any)?.name ?? (exception as any)?.constructor?.name ?? 'Error',
    };

    this.addDevFields(body, httpAdapter, request, exception);
    this.logException(exception, body);
    return httpAdapter.reply(response, body, httpStatus);
  }

  private addDevFields(
    body: ErrorResponse,
    httpAdapter: any,
    request: Request,
    exception: unknown,
  ) {
    if (this.isProd) {
      return;
    }

    body.timestamp = new Date().toISOString();
    body.path = httpAdapter.getRequestUrl(request);

    if (exception instanceof Error) {
      body.stack = exception.stack;
    }
  }

  private logException(exception: unknown, body: ErrorResponse) {
    const prefix = this.isProd ? '' : '[DEV] ';
    this.logger.error(
      `${prefix}[${body.code ?? 'NO_CODE'}] ${body.message}`,
      exception instanceof Error ? exception.stack : undefined,
    );
  }
}
