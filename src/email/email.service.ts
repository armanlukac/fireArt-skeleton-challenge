import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendVerificationEmail(
    email: string,
    first_name: string,
    token: string,
  ) {
    const verificationLink = `${this.configService.get<string>('EMAIL_VERIFICATION_URL')}?token=${token}`;
    const response = await this.resend.emails.send({
      from: this.configService.get<string>('EMAIL_FROM', 'arman@resend.dev'),
      to: email,
      subject: '[Skeleton Challenge] Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <br>
        <p>Hi ${first_name}, please click the link below to verify your email:</p>
        <br>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });

    return response;
  }

  async sendResetEmail(email: string, resetLink: string) {
    const response = await this.resend.emails.send({
      from: this.configService.get<string>('EMAIL_FROM', 'arman@resend.dev'),
      to: email,
      subject: '[Skeleton Challenge] Password Reset',
      html: `
        <h1>Password Reset</h1>
        <br>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <br>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return response;
  }
}
