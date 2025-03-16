import { IsEmail } from 'class-validator';

export class RequestResetOtpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;
}
