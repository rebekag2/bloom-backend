import { Body, Controller, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshJwtGuard } from './refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);

    if (!user) {
      return { message: 'Invalid username or password' };
    }

    return this.authService.login(user);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(@Req() req, @Body() body: { refreshToken: string }) {
    const user = req.user; // user payload from RefreshJwtGuard
    const refreshToken = body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    return this.authService.refresh(user.sub, refreshToken);
  }
}
