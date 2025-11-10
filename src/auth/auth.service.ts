import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: any): string {
    console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET);
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: parseExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN) || 3 * 60 * 60, // fallback 3 hours
    });
  }

  generateRefreshToken(payload: any): string {
    console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: parseExpiresIn(process.env.JWT_REFRESH_EXPIRES_IN) || 7 * 24 * 60 * 60, // fallback 7 days
    });
  }

  validateRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

function parseExpiresIn(value?: string): number | undefined {
  if (!value) return undefined;

  // Cast string as ms.StringValue to satisfy TypeScript
  const milliseconds = ms(value as StringValue);

  if (typeof milliseconds === 'number') {
    return Math.floor(milliseconds / 1000);
  }
  return undefined;
}
