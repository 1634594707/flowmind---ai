import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateRequirementSessionDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;
}
