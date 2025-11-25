// src/common/errors/auth.errors.ts
import { AppError } from '../app-error.js';

export class EmailTakenError extends AppError {
  constructor(email: string) {
    super({
      code: 'AUTH.EMAIL_TAKEN',
      statusCode: 400,
      message: `Email "${email}" is already taken`,
    });
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super({
      code: 'AUTH.INVALID_CREDENTIALS',
      statusCode: 401,
      message: 'Invalid email or password',
    });
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super({
      code: 'USERS.NOT_FOUND',
      statusCode: 404,
      message: 'User not found',
    });
  }
}
