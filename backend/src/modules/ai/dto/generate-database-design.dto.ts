import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class GenerateDatabaseDesignDto {
  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  sourceDocumentId?: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  documentTitle?: string;
}
