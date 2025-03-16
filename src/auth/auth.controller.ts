import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from '../users/users.service';

@Controller('auth') // Ensure route prefix is set
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(
      body.email,
      body.password,
      body.first_name || '',
      body.last_name || '',
    );
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    console.log('VERIFY EMAIL');
    console.log('token', token);
    if (!token) {
      throw new BadRequestException('Invalid or missing verification token');
    }

    const user = await this.usersService.verifyUser(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    return { message: 'Email verified successfully. You can now log in.' };
  }
}
