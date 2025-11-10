import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // Check if user with the same email or username already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const user = this.usersRepository.create({
      username,
      email,
      password, // hashed automatically by @BeforeInsert in your entity
    });

    return this.usersRepository.save(user);
  }

  // 🟢 LOGIN LOGIC
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // exclude password from response
    return result;
  }
}
