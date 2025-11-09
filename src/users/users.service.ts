import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';

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

    // Check if user with the same email or username already exists (optional but recommended)
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const user = this.usersRepository.create({
      username,
      email,
      password, // this will be hashed automatically by @BeforeInsert in User entity
    });

    return this.usersRepository.save(user);
  }
}
