import { IsIn, IsOptional } from 'class-validator';

const AGILE_STAGES = ['requirements', 'design', 'development', 'testing', 'release'] as const;

export class TransitionProjectStageDto {
  @IsOptional()
  @IsIn(AGILE_STAGES)
  toStage?: (typeof AGILE_STAGES)[number];
}
