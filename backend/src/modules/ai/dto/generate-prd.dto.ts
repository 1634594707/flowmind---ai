import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GeneratePrdDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  documentTitle?: string;
}
