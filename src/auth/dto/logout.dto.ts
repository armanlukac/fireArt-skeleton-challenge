import { IsString } from 'class-validator';

export class LogoutDto {
  @IsString({ message: 'access_token must be a string' })
  access_token?: string;
}
