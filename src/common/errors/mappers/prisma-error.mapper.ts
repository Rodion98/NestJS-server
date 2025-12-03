import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorResponse } from '../error-response.interface.js';

export function mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): {
  httpStatus: number;
  body: ErrorResponse;
} {
  let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  let body: ErrorResponse;

  switch (exception.code) {
    case 'P2002':
      httpStatus = HttpStatus.CONFLICT;
      body = {
        statusCode: httpStatus,
        code: 'DB.UNIQUE_CONSTRAINT',
        message: 'Unique constraint violation',
        details: exception.meta,
        error: 'Conflict',
      };
      break;

    case 'P2003':
      httpStatus = HttpStatus.CONFLICT;
      body = {
        statusCode: httpStatus,
        code: 'DB.FOREIGN_KEY_CONSTRAINT',
        message: 'Foreign key constraint violation',
        details: exception.meta,
        error: 'Conflict',
      };
      break;

    case 'P2025':
      httpStatus = HttpStatus.NOT_FOUND;
      body = {
        statusCode: httpStatus,
        code: 'DB.RECORD_NOT_FOUND',
        message: 'Record not found',
        details: exception.meta,
        error: 'Not Found',
      };
      break;

    case 'P2000':
      httpStatus = HttpStatus.BAD_REQUEST;
      body = {
        statusCode: httpStatus,
        code: 'DB.VALUE_TOO_LONG',
        message: 'Value too long for column',
        details: exception.meta,
        error: 'Bad Request',
      };
      break;

    case 'P2014':
      httpStatus = HttpStatus.CONFLICT;
      body = {
        statusCode: httpStatus,
        code: 'DB.RELATION_VIOLATION',
        message: 'Relation constraint violation',
        details: exception.meta,
        error: 'Conflict',
      };
      break;

    case 'P2016':
      httpStatus = HttpStatus.BAD_REQUEST;
      body = {
        statusCode: httpStatus,
        code: 'DB.QUERY_INTERPRETATION_ERROR',
        message: 'Query interpretation error',
        details: exception.meta,
        error: 'Bad Request',
      };
      break;

    case 'P2018':
      httpStatus = HttpStatus.NOT_FOUND;
      body = {
        statusCode: httpStatus,
        code: 'DB.CONNECTED_RECORD_NOT_FOUND',
        message: 'Required connected record not found',
        details: exception.meta,
        error: 'Not Found',
      };
      break;

    case 'P2021':
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      body = {
        statusCode: httpStatus,
        code: 'DB.TABLE_NOT_FOUND',
        message: 'Table does not exist',
        details: exception.meta,
        error: 'Internal Server Error',
      };
      break;

    case 'P2022':
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      body = {
        statusCode: httpStatus,
        code: 'DB.COLUMN_NOT_FOUND',
        message: 'Column does not exist',
        details: exception.meta,
        error: 'Internal Server Error',
      };
      break;

    case 'P2034':
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      body = {
        statusCode: httpStatus,
        code: 'DB.TRANSACTION_FAILED',
        message: 'Transaction failed',
        details: exception.meta,
        error: 'Internal Server Error',
      };
      break;

    default:
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      body = {
        statusCode: httpStatus,
        code: 'DB.PRISMA_ERROR',
        message: 'Unhandled Prisma error',
        details: {
          code: exception.code,
          meta: exception.meta,
        },
        error: 'Internal Server Error',
      };
      break;
  }

  return { httpStatus, body };
}
