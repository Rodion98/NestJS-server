import { AppError } from '../app-error.js';
import { ErrorResponse } from '../error-response.interface.js';

export function mapAppError(exception: AppError): {
  httpStatus: number;
  body: ErrorResponse;
} {
  return {
    httpStatus: exception.statusCode,
    body: {
      statusCode: exception.statusCode,
      code: exception.code,
      message: exception.message,
      details: exception.details,
    },
  };
}
