import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity.js';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/sign_in.dto.js';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Хэширование пароля с использованием bcrypt
   * (вынеси rounds в конфиг, если нужно централизованно менять)
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Генерация access и refresh токенов.
   * Здесь payload — минимальный набор данных (sub = user.id)
   */
  private async getTokens(payload: {
    sub: number;
    email: string;
    role?: string;
  }) {
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: '15m', // короткий срок жизни access токена
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: '7d', // refresh живёт дольше
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Авторизация пользователя по email и паролю.
   * Проверка существования пользователя и сравнение пароля.
   */
  async login(email: string, password: string): Promise<AuthEntity> {
    // 1. Проверяем, есть ли пользователь с таким email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // 2. Сравниваем пароли (plain vs hashed)
    //    Убедись, что поле в Prisma называется "password"
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // 3. Генерируем токены
    const tokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Возвращаем токены (user можно добавить по необходимости)
    return {
      ...tokens,
    };
  }

  /**
   * Регистрация нового пользователя.
   * Создаёт запись в БД, предварительно проверяя уникальность email.
   */
  async register(dto: RegisterDto): Promise<AuthEntity> {
    // 1. Проверяем, что email свободен
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Хэшируем пароль перед сохранением
    const passwordHash = await this.hashPassword(dto.password);

    // 3. Создаём пользователя через UsersService
    //    UsersService не занимается хэшированием — всё делает AuthService
    const user = await this.usersService.create({
      email: dto.email,
      password: passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    } as any);

    // 4. Генерируем токены для нового пользователя
    const tokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Возвращаем токены (по желанию можно добавить user в ответ)
    return {
      ...tokens,
    };
  }
}
