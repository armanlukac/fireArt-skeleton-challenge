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
import { RequestWithUser } from './types/request-with-user';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { RequestResetOtpDto } from './dto/request-reset-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

@Controller('auth') // Ensure route prefix is set
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
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

  @Post('request-password-reset')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async requestPasswordReset(@Body() body: RequestResetDto) {
    const user = await this.usersService.getUserByEmail(body.email);
    if (!user) {
      return { message: 'User not found. Check for typos in your email.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await this.usersService.storeResetToken(user.id, resetToken, expiresAt);

    const resetLink = `${this.configService.get<string>('PASSWORD_RESET_URL')}?token=${resetToken}`;
    await this.emailService.sendResetEmail(user.email, resetLink);

    return {
      message: 'Reset link has been sent. Check your email.',
      resetToken,
    };
  }

  @Post('request-password-reset-otp')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async requestPasswordResetOtp(@Body() body: RequestResetOtpDto) {
    const user = await this.usersService.getUserByEmail(body.email);
    if (!user) {
      return { message: 'User not found. Check for typos in your email.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.usersService.storeResetOtp(user.id, otp, expiresAt);

    return { message: 'OTP generated.', otp };
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async resetPassword(@Body() body: ResetPasswordDto) {
    console.log('Called resetPassword');
    const userId = await this.usersService.validateResetTokenOrOtp(
      body.token,
      body.otp,
    );

    console.log('userId', userId);
    if (!userId) {
      throw new BadRequestException('Invalid or expired reset token/OTP.');
    }

    await this.usersService.updatePassword(userId, body.new_password);
    await this.usersService.markResetUsed(userId);

    return { message: 'Password reset successfully' };
  }
}
