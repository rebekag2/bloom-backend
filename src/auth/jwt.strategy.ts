import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Bearer token in header
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Get secret from config service (.env)
    });
  }

  async validate(payload: any) {
    // This method is called automatically after JWT is verified.
    // The "payload" is the decoded JWT payload.
    // Here, you can add extra validation or fetch user info from DB if needed.
    // For now, just return the user data embedded in JWT (like userId and email).
    return { userId: payload.sub, email: payload.email };
  }
}
