import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('project_github_repos')
@Index(['projectId'], { unique: true })
export class ProjectGithubRepo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'repo_id' })
  repoId: number;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ name: 'html_url', length: 500, nullable: true })
  htmlUrl: string;

  @Column({ name: 'default_branch', length: 255, nullable: true })
  defaultBranch: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
