import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../error-response.interface.js';

export function mapHttpException(exception: HttpException): {
  httpStatus: number;
  body: ErrorResponse;
} {
  const httpStatus = exception.getStatus();
  const res = exception.getResponse();

  // Отдельный кейс для ValidationPipe (BadRequestException + массив message)
  if (exception instanceof BadRequestException) {
    const r: any = res;
    const message = r?.message;

    if (Array.isArray(message)) {
      return {
        httpStatus,
        body: {
          statusCode: httpStatus,
          code: 'VALIDATION.ERROR',
          message: 'Validation failed',
          details: message,
          error: r.error ?? 'Bad Request',
        },
      };
    }
  }

  // Общий кейс
  let message: string | string[] = 'Error';
  let error: string | undefined;
  let code: string | undefined;

  if (typeof res === 'string') {
    message = res;
  } else if (res && typeof res === 'object') {
    const r: any = res;
    message = r.message ?? 'Error';
    error = r.error;
    code = r.code;
  }

  if (!code) {
    code = mapStatusToDefaultCode(httpStatus);
  }

  return {
    httpStatus,
    body: {
      statusCode: httpStatus,
      message,
      error,
      code,
    },
  };
}

function mapStatusToDefaultCode(status: number): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'COMMON.BAD_REQUEST';
    case HttpStatus.UNAUTHORIZED:
      return 'COMMON.UNAUTHORIZED';
    case HttpStatus.FORBIDDEN:
      return 'COMMON.FORBIDDEN';
    case HttpStatus.NOT_FOUND:
      return 'COMMON.NOT_FOUND';
    default:
      return 'COMMON.HTTP_ERROR';
  }
}
