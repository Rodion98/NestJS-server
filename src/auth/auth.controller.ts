import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity.js';
import { LogInDto } from './dto/log_in.dto.js';
import { SignInDto } from './dto/sign_in.dto.js';
import { RefreshTokenGuard } from '../common/guards/refresh_token.guard.js';
import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators/index.js';
import { AccessTokenGuard } from '../common/guards/index.js';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('log_in')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() dto: LogInDto): Promise<AuthEntity> {
    return this.authService.log_in(dto);
  }

  @Public()
  @Post('sign_in')
  @ApiOkResponse({ type: AuthEntity })
  async register(@Body() dto: SignInDto): Promise<AuthEntity> {
    return this.authService.sign_up(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiBody({
    description: 'Refresh token payload',
    schema: {
      example: {
        refreshToken: 'token',
      },
    },
  })
  async refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<AuthEntity> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
