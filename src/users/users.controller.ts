import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.createUser(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error: unknown) {
      // To safely handle error object and access message:
      if (error instanceof Error) {
        // Use NestJS HttpException for better error handling
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
