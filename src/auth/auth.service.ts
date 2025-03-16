import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async signup(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
  ) {
    if (!email || !password || !first_name || !last_name) {
      throw new BadRequestException(
        'Missing required fields. Please insert email, password, first name, and last name',
      );
    }

    // Check if user already exists
    const existingUser = await this.usersService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.usersService.createUser(
      email,
      password,
      first_name,
      last_name,
    );

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await this.usersService.saveVerificationToken(user.id, verificationToken);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.first_name,
      verificationToken,
    );

    if (user) {
      return {
        message: `User registered successfully. Email: ${email}`,
      };
    }
  }
}
