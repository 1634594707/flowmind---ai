import { IsIn, IsString } from 'class-validator';

export class AddRequirementMessageDto {
  @IsIn(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @IsString()
  content: string;
}
