import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from 'src/entities/emotions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmotionsService {
  constructor(
    @InjectRepository(Emotion)
    private readonly emotionRepository: Repository<Emotion>,
  ) {}

  findAll(): Promise<Emotion[]> {
    return this.emotionRepository.find();
  }
}
