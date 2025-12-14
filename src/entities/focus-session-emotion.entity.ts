import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { FocusSession } from './focus-session.entity';
import { Emotion } from './emotions.entity';

@Entity({ name: 'focussessionemotions' })
export class FocusSessionEmotion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FocusSession)
  @JoinColumn({ name: 'focus_session_id' })
  focusSession: FocusSession;

  @ManyToOne(() => Emotion)
  @JoinColumn({ name: 'emotion_before_id' })
  emotionBefore: Emotion;

  @ManyToOne(() => Emotion)
  @JoinColumn({ name: 'emotion_after_id' })
  emotionAfter: Emotion | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
