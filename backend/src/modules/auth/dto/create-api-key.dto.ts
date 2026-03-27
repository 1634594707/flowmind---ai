import { IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;
}
