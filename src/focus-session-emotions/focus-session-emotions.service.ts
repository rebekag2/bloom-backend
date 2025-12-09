import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FocusSessionEmotion } from 'src/entities/focus-session-emotion.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FocusSessionEmotionsService {
  constructor(
    @InjectRepository(FocusSessionEmotion)
    private readonly focusSessionEmotionRepository: Repository<FocusSessionEmotion>,
  ) {}

  async addEmotions(focusSessionId: number, emotionBeforeId: number, emotionAfterId: number): Promise<FocusSessionEmotion> {
    const newEntry = this.focusSessionEmotionRepository.create({
      focusSession: { id: focusSessionId },
      emotionBefore: { id: emotionBeforeId },
      emotionAfter: { id: emotionAfterId },
    });
    return this.focusSessionEmotionRepository.save(newEntry);
  }

  async getEmotionsForSession(focusSessionId: number): Promise<FocusSessionEmotion[]> {
    return this.focusSessionEmotionRepository.find({
      where: { focusSession: { id: focusSessionId } },
      relations: ['emotionBefore', 'emotionAfter'],
    });
  }
}
