// src/common/errors/auth.errors.ts
import { AppError } from '../app-error.js';

export class EmailTakenError extends AppError {
  constructor(email: string) {
    super({
      code: 'AUTH.EMAIL_TAKEN',
      statusCode: 409,
      message: `Email "${email}" is already taken`,
    });
  }
}

/**
 * Ошибка именно про логин/пароль.
 * Не про "нет прав", а про "неверные учетные данные".
 */
export class InvalidCredentialsError extends AppError {
  constructor(message?: string) {
    super({
      code: 'AUTH.INVALID_CREDENTIALS',
      statusCode: 401,
      message: message ?? 'Invalid email or password',
    });
  }
}

// === REFRESH TOKEN FLOW ===

/**
 * Рефреш токен вообще не передан.
 */
export class RefreshTokenRequiredError extends AppError {
  constructor() {
    super({
      code: 'AUTH.REFRESH_TOKEN_REQUIRED',
      statusCode: 401,
      message: 'Refresh token is required',
    });
  }
}

/**
 * Пользователь не найден или у него нет refreshTokenHash.
 * По сути — сессии нет / пользователь разлогинен.
 */
export class RefreshTokenNotFoundError extends AppError {
  constructor() {
    super({
      code: 'AUTH.REFRESH_TOKEN_NOT_FOUND',
      statusCode: 401,
      message: 'Refresh token not found or user is logged out',
    });
  }
}

/**
 * Рефреш токен не совпал с хэшем в БД.
 */
export class RefreshTokenInvalidError extends AppError {
  constructor() {
    super({
      code: 'AUTH.REFRESH_TOKEN_INVALID',
      statusCode: 403,
      message: 'Refresh token is invalid',
    });
  }
}

// === CHANGE PASSWORD ===

/**
 * Текущий пароль введён неверно.
 */
export class CurrentPasswordInvalidError extends AppError {
  constructor() {
    super({
      code: 'AUTH.CURRENT_PASSWORD_INVALID',
      statusCode: 401,
      message: 'Current password is incorrect',
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super({
      code: 'AUTH.UNAUTHORIZED',
      statusCode: 401,
      message,
    });
  }
}
