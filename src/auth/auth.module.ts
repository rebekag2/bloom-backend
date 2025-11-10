import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import ms, { StringValue } from 'ms';
import { ConfigModule } from '@nestjs/config';

const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN as StringValue | undefined;

@Module({
  imports: [
    ConfigModule, 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: jwtAccessExpiresIn
          ? Math.floor(ms(jwtAccessExpiresIn) / 1000)
          : 3 * 60 * 60, // fallback 3 hours in seconds
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
