import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ default: 'general' })
  type: string; // prd, design, api, test, general

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'status', default: 'DRAFT' })
  status: string; // DRAFT, REVIEW, FROZEN

  @Column({ name: 'change_level', type: 'varchar', nullable: true })
  changeLevel: string | null; // MINOR, MAJOR

  @Column({ name: 'change_reason', type: 'text', nullable: true })
  changeReason: string | null;

  @Column({ name: 'frozen_at', type: 'timestamptz', nullable: true })
  frozenAt: Date | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: '1.0' })
  version: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
