import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; // Make sure you have a UsersModule
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Import your UsersModule to fetch users during auth
    PassportModule, // Passport helps with authentication strategies
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use secret from .env file
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, // Token expiration time
    }),
  ],
  providers: [AuthService, JwtStrategy], // AuthService handles login, JwtStrategy validates JWT tokens
  controllers: [AuthController], // Controller to expose login endpoint
  exports: [AuthService], // Export AuthService if needed elsewhere
})
export class AuthModule {}
