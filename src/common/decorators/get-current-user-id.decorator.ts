// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { JwtPayload } from '../../auth/types/jwtPayload.type.js';

// export const GetCurrentUserId = createParamDecorator(
//   (_: undefined, context: ExecutionContext): number => {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user as JwtPayload;
//     return user.sub;
//   },
// );
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { id?: number };

    if (!user || typeof user.id !== 'number') {
      throw new UnauthorizedException('User id not found in request.user');
    }

    return user.id;
  },
);
