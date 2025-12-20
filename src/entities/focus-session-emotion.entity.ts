import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { FocusSession } from './focus-session.entity';
import { Emotion } from './emotions.entity';

@Entity({ name: 'focussessionemotions' })
export class FocusSessionEmotion {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => FocusSession, session => session.focusSessionEmotion, {
    onDelete: 'CASCADE',
  })
  focusSession: FocusSession;

  @ManyToOne(() => Emotion, { eager: true })
  @JoinColumn( { name: 'emotion_before_id'})
  emotionBefore: Emotion;

  @ManyToOne(() => Emotion, { nullable: true, eager: true })
  @JoinColumn( { name: 'emotion_after_id'})
  emotionAfter: Emotion | null;

}
