import {
  IsString,
  IsEmail,
  IsUrl,
  IsInt,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Company name must be at least 2 characters long' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  contact?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid website URL' })
  website?: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
