import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'emotions' })
export class Emotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;
}
