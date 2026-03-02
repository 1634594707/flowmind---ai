import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatRequirementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}
