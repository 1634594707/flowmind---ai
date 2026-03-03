import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class QueryTasksDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsIn(['todo', 'in_progress', 'done'])
  status?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsUUID()
  sourceDocumentId?: string;
}
