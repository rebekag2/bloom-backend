import { Controller, Post, Req, Res, UnauthorizedException, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailService } from 'src/email/email.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly emailService: EmailService,) {}

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const payload = await this.authService.verifyRefreshToken(refreshToken);
    const tokens = await this.authService.refresh(payload.sub, refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken: tokens.accessToken });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const payload = await this.authService.verifyRefreshToken(refreshToken);
        await this.authService.logout(payload.sub);
      } catch {}
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return res.json({ message: 'Logged out successfully' });
  }

  // ⭐ REQUEST PASSWORD RESET
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' }
      },
      required: ['email']
    }
  })
  
 @Post('request-password-reset')
async requestPasswordReset(@Body('email') email: string) {
  if (!email) throw new BadRequestException('Email required');

  const token = await this.authService.requestPasswordReset(email);

  if (token) {
    await this.emailService.sendPasswordResetEmail(email, token);
  }

  return { message: 'If this email exists, a reset link was sent.' };
}


  // ⭐ RESET PASSWORD
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'abc123resetToken' },
        newPassword: { type: 'string', example: 'NewPassword123' }
      },
      required: ['token', 'newPassword']
    }
  })
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password required');
    }

    await this.authService.resetPassword(token, newPassword);

    return { message: 'Password reset successfully' };
  }
}
