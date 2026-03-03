import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class DecomposeTasksDto {
  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  sourceDocumentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  context?: string;
}
