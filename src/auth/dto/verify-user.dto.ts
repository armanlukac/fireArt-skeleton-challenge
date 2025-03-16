import { IsEmail } from 'class-validator';

export class VerifyUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;
}
