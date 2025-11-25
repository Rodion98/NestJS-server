// src/common/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppError } from '../errors/app-error.js';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  code?: string;
  error?: string;
  details?: unknown;
  // поля, которые будем добавлять только в DEV
  timestamp?: string;
  path?: string;
  stack?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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

    // 1) Наши доменные ошибки AppError
    if (exception instanceof AppError) {
      httpStatus = exception.statusCode;

      body = {
        statusCode: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.details,
      };

      this.addDevFields(body, httpAdapter, request, exception);
      return httpAdapter.reply(response, body, httpStatus);
    }

    // 2) HttpException (NotFoundException, ForbiddenException, ValidationPipe и т.д.)
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const res = exception.getResponse();

      // Особый кейс: ошибки валидации (ValidationPipe)
      if (exception instanceof BadRequestException) {
        const r: any = res;
        const message = r?.message;

        if (Array.isArray(message)) {
          body = {
            statusCode: httpStatus,
            code: 'VALIDATION.ERROR',
            message: 'Validation failed',
            details: message, // массив с текстами ошибок
            error: r.error ?? 'Bad Request',
          };

          this.addDevFields(body, httpAdapter, request, exception);
          return httpAdapter.reply(response, body, httpStatus);
        }
      }

      // Общий кейс для любых HttpException
      let message: string | string[] = 'Error';
      let error: string | undefined;
      let code: string | undefined;

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r: any = res;
        message = r.message ?? 'Error';
        error = r.error;
        code = r.code;
      }

      body = {
        statusCode: httpStatus,
        message,
        error,
        code,
      };

      this.addDevFields(body, httpAdapter, request, exception);
      return httpAdapter.reply(response, body, httpStatus);
    }

    // 3) Любая другая ошибка — считаем 500кой
    body = {
      statusCode: httpStatus,
      message: 'Internal server error',
      error: (exception as any)?.name ?? (exception as any)?.constructor?.name ?? 'Error',
    };

    // логируем всегда
    // eslint-disable-next-line no-console
    console.error(exception);

    this.addDevFields(body, httpAdapter, request, exception);
    return httpAdapter.reply(response, body, httpStatus);
  }

  private addDevFields(body: ErrorResponse, httpAdapter: any, request: any, exception: unknown) {
    if (this.isProd) {
      return;
    }

    body.timestamp = new Date().toISOString();
    body.path = httpAdapter.getRequestUrl(request);

    if (exception instanceof Error) {
      body.stack = exception.stack;
    }
  }
}
