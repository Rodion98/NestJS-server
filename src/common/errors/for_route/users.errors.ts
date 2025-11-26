import { AppError } from '../app-error.js';

export class UserNotFoundError extends AppError {
  constructor() {
    super({
      code: 'USERS.NOT_FOUND',
      statusCode: 404,
      message: 'User not found',
    });
  }
}
