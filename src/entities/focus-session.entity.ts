import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { User } from './users.entity';
import { FocusSessionEmotion } from './focus-session-emotion.entity';

@Entity({ name: 'focussessions' })
export class FocusSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'start_time', type: 'datetime' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  endTime: Date | null;

  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  canceled: boolean;
  
  @OneToOne(
    () => FocusSessionEmotion,
    (emotion) => emotion.focusSession,
    { cascade: true, eager: true },
  )
  @JoinColumn()
  focusSessionEmotion: FocusSessionEmotion;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}