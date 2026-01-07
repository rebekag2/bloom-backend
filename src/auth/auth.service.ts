import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/users.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return user;
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, username: user.username };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '10m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async login(user: User) {
    const tokens = this.generateTokens(user);

    const hashed = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersRepo.update(user.id, { refreshToken: hashed });

    return tokens;
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens(user);

    const hashed = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersRepo.update(user.id, { refreshToken: hashed });

    return tokens;
  }

  async logout(userId: number) {
    await this.usersRepo.update(userId, { refreshToken: null });
  }

  // ⭐ STEP 2A — REQUEST PASSWORD RESET
  async requestPasswordReset(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });

    // Always return success to avoid email enumeration
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;

    await this.usersRepo.save(user);

    return token; // controller will send email
  }

  // ⭐ STEP 2B — RESET PASSWORD
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersRepo.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.usersRepo.save(user);

    return true;
  }
}
