import { IsString, MinLength, Matches, ValidateIf } from 'class-validator';

export class ResetPasswordDto {
  @ValidateIf((o) => !o.otp) // Require token if OTP is not provided
  @IsString({ message: 'Reset token must be a string' })
  token?: string;

  @ValidateIf((o) => !o.token) // Require OTP if token is not provided
  @IsString({ message: 'OTP must be a string' })
  otp?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[@$!%*?&]/, {
    message: 'Password must contain at least one special character (@$!%*?&)',
  })
  new_password!: string;
}
