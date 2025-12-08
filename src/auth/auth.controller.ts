import { Body, Controller, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshJwtGuard } from './refresh-jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @ApiBearerAuth('access-token')     
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const user = req.user;
    await this.authService.logout(user.sub);
    return { message: 'Logged out successfully' };
  }
}
