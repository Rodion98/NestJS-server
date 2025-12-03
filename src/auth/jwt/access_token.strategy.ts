import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwtPayload.type.js';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Если хочешь проверять, что пользователь ещё существует/не забанен —
    // можно на этом уровне сходить в базу, НО вернуть всё равно payload.
    // Пример (раскомментируешь, если нужно):

    // const user = await this.usersService.findOne(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }

    return payload;
  }
}
