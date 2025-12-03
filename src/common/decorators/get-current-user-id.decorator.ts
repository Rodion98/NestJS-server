import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UnauthorizedError } from '../errors/for_route/auth.errors.js';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    console.log('request.user in GetCurrentUserId:', request.user);
    const user = request.user as { sub?: number };

    if (!user || typeof user.sub !== 'number') {
      throw new UnauthorizedError('User id not found in request.user');
    }

    return user.sub;
  },
);
