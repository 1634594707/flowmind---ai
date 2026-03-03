import { IsString, IsUUID, MaxLength } from 'class-validator';

export class BindGithubRepoDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @MaxLength(255)
  fullName: string;
}
