import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.createUser(createUserDto);
      // Remove password before sending response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 @Post('login')
async login(@Body() loginUserDto: LoginUserDto) {
  try {
    const user = await this.usersService.loginUser(loginUserDto);
    // After successful login, generate tokens
    const payload = { username: user.username, sub: user.id };

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        // don't send password
      },
      accessToken: this.authService.generateAccessToken(payload),
      refreshToken: this.authService.generateRefreshToken(payload),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}
