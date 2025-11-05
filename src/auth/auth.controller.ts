import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/sign_in.dto.js';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('log_in')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('sign_in')
  @ApiOkResponse({ type: AuthEntity })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
