import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity.js';
import { UsersService } from '../users/users.service.js';
import { SignInDto as SignUpDto } from './dto/sign_in.dto.js';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwtPayload.type.js';
import { LogInDto } from './dto/log_in.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}


   /**
   * Регистрация нового пользователя.
   * Создаёт запись в БД, предварительно проверяя уникальность email.
   */
  async sign_up (dto: SignUpDto): Promise<AuthEntity> {
    // 1. Проверяем, что email свободен
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Хэшируем пароль перед сохранением
    const passwordHash = await argon2.hash(dto.password);

    // 3. Создаём пользователя через UsersService
    //    UsersService не занимается хэшированием — всё делает AuthService
    const user = await this.usersService.create({
      email: dto.email,
      password: passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    } as any);

    // 4. Генерируем токены для нового пользователя
    const tokens = await this.getTokens(user.id,user.email);

    // 5. Записываем токены в БД пользователю
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    // 6. Возвращаем токены (по желанию можно добавить user в ответ)
    return tokens;
  }


     /**
//    * Авторизация пользователя по email и паролю.
//    * Проверка существования пользователя и сравнение пароля.
//    */
  async log_in(dto: LogInDto): Promise<AuthEntity> {

    // 1. Проверяем, есть ли пользователь с таким email
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }
    
     // 2. Сравниваем пароли (plain vs hashed)
    const passwordMatches = await argon2.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    
    // 3. Генерируем токены
    const tokens = await this.getTokens(user.id, user.email);

    // 4. Обновляем токены в БД
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }


    async refreshTokens(userId: number, refreshToken: string): Promise<AuthEntity> {

        if (!refreshToken) {
    throw new UnauthorizedException('Refresh token is required');
  }

    // 2. Ищем пользователя
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied');
    }


    // 3. Сравниваем переданный refreshToken с хэшом из БД
    const rtMatches = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    // 4. Генерируем новые токены
    const tokens = await this.getTokens(user.id, user.email);

    // 5. Обновляем hash нового refresh токена
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }


  async getTokens(userId: number, email: string): Promise<AuthEntity> {

    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn = this.config.get<string>('security.expiresIn');
    const refreshExpiresIn = this.config.get<string>('security.refreshIn');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: accessSecret,
      expiresIn: accessExpiresIn, 
      }),
      this.jwtService.signAsync(jwtPayload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string): Promise<void> {
    const hash = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshTokenHash(userId,hash)
  }
}
