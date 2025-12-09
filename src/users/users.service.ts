import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly settingsService: SettingsService, // ⬅ ADD THIS
  ) {}

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // Check for duplicates
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create user
    const user = this.usersRepository.create({
      username,
      email,
      password,
    });

    const savedUser = await this.usersRepository.save(user);

    await this.settingsService.createDefaultSettingsForUser(savedUser);

    return savedUser;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<Partial<User>> {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user;
    return result;
  }
}
