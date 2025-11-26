import { AppError } from '../app-error.js';

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super({
      code: 'COMMON.FORBIDDEN',
      statusCode: 403,
      message,
    });
  }
}
