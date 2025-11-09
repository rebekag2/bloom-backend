import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'settings' })
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'notification_sound', type: 'tinyint', width: 1 })
  notificationSound: boolean;

  @Column({
    name: 'first_day_of_week',
    type: 'enum',
    enum: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
  })
  firstDayOfWeek:
    | 'Luni'
    | 'Marți'
    | 'Miercuri'
    | 'Joi'
    | 'Vineri'
    | 'Sâmbătă'
    | 'Duminică';

  @Column({ name: 'default_focus_time', type: 'int' })
  defaultFocusTime: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
