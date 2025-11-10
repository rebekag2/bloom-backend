import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const payload = this.authService.validateRefreshToken(body.refreshToken);

    // Generate a new access token
    const accessToken = this.authService.generateAccessToken({ username: payload.username, sub: payload.sub });

    return { accessToken };
  }
}
