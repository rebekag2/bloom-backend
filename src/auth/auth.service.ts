import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: parseExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN) || 3 * 60 * 60,
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: parseExpiresIn(process.env.JWT_REFRESH_EXPIRES_IN) || 7 * 24 * 60 * 60,
    });
  }
}

function parseExpiresIn(value?: string): number | undefined {
  if (!value) return undefined;

  // Cast string as ms.StringValue to satisfy TypeScript
  const milliseconds = ms(value as ms.StringValue);

  if (typeof milliseconds === 'number') {
    return Math.floor(milliseconds / 1000);
  }
  return undefined;
}
