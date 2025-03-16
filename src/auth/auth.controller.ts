import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth') // Ensure route prefix is set
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
