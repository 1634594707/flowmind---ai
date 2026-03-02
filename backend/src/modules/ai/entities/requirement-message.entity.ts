import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RequirementSession } from './requirement-session.entity';

@Entity('requirement_messages')
export class RequirementMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => RequirementSession, (s) => s.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: RequirementSession;

  @Column({ length: 20 })
  role: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
