import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/users.entity';

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

  async login(user: User) {
    const payload = { sub: user.id, username: user.username };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30m', // 30 minutes
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d', // 7 days
    });

    // store hashed refresh token in DB
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.update(user.id, { refreshToken: hashed });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
  // Clear the stored refresh token for this user
    await this.usersRepo.update(userId, { refreshToken: null });
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

    const payload = { sub: user.id, username: user.username };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30m',
    });

    return { accessToken };
  }
}
