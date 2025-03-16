import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RequestWithUser } from './types/request-with-user';
import { JwtService } from '@nestjs/jwt';

@Controller('auth') // Ensure route prefix is set
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async logout(@Body() body: LogoutDto, @Req() req: RequestWithUser) {
    // Ensure request contains a valid token
    if (!req.user) {
      return { message: 'Invalid token or user not authenticated' };
    }

    const token = body.access_token;
    if (!token) {
      throw new BadRequestException('Access token is missing');
    }
    const decoded = (await this.jwtService.decode(token)) as { exp: number };

    if (!decoded || !decoded.exp) {
      return { message: 'Invalid token' };
    }

    const expiresAt = new Date(decoded.exp * 1000);
    await this.usersService.blacklistToken(token, expiresAt);

    return { message: 'Logged out successfully' };
  }
}
