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
      from: this.configService.get<string>(
        'EMAIL_FROM',
        'onboarding@resend.dev',
      ),
      to: email,
      subject: '[Skeleton Challenge] Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Hi ${first_name}, please click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });
    console.log('RESPONSE ON VERIFICATION EMAIL:', response);

    return response;
  }
}
