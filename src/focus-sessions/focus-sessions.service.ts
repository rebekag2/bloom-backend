import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FocusSession } from 'src/entities/focus-session.entity';
import { User } from 'src/entities/users.entity';
import { FocusSessionEmotion } from 'src/entities/focus-session-emotion.entity';
import { Emotion } from 'src/entities/emotions.entity';

@Injectable()
export class FocusSessionsService {
  constructor(
    @InjectRepository(FocusSession)
    private readonly focusSessionsRepository: Repository<FocusSession>,

    @InjectRepository(FocusSessionEmotion)
    private readonly focusSessionEmotionRepository: Repository<FocusSessionEmotion>,

    @InjectRepository(Emotion)
    private readonly emotionRepository: Repository<Emotion>,
  ) {}

  // START SESSION
  async startFocusSession(
    userId: number,
    durationMinutes: number,
    emotionBeforeId: number,
  ): Promise<FocusSession> {
    const now = new Date();

    const session = this.focusSessionsRepository.create({
      user: { id: userId } as User,
      startTime: now,
      endTime: null,
      durationMinutes, // planned duration (temporary)
      canceled: false,
    });

    const savedSession = await this.focusSessionsRepository.save(session);

    const emotionBefore = await this.emotionRepository.findOneBy({
      id: emotionBeforeId,
    });
    if (!emotionBefore) {
      throw new NotFoundException('Emotion before session not found');
    }

    const sessionEmotion = this.focusSessionEmotionRepository.create({
      focusSession: savedSession,
      emotionBefore,
      emotionAfter: null,
    });

    await this.focusSessionEmotionRepository.save(sessionEmotion);

    return savedSession;
  }

  // CANCEL SESSION (same time logic as finish)
  async cancelFocusSession(sessionId: number): Promise<FocusSession> {
    const session = await this.focusSessionsRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Focus session not found');

    const endTime = new Date();
    const diffMs = endTime.getTime() - session.startTime.getTime();
    const focusedMinutes = Math.max(1, Math.floor(diffMs / 60000));

    session.endTime = endTime;
    session.durationMinutes = focusedMinutes;
    session.canceled = true;

    return this.focusSessionsRepository.save(session);
  }

  // FINISH SESSION
  async finishFocusSession(
    sessionId: number,
    emotionAfterId: number,
  ): Promise<FocusSession> {
    const session = await this.focusSessionsRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Focus session not found');

    const emotionAfter = await this.emotionRepository.findOneBy({
      id: emotionAfterId,
    });
    if (!emotionAfter) {
      throw new NotFoundException('Emotion after session not found');
    }

    const endTime = new Date();
    const diffMs = endTime.getTime() - session.startTime.getTime();
    const focusedMinutes = Math.max(1, Math.floor(diffMs / 60000));

    session.endTime = endTime;
    session.durationMinutes = focusedMinutes;
    session.canceled = false;

    await this.focusSessionsRepository.save(session);

    const sessionEmotion = await this.focusSessionEmotionRepository.findOne({
      where: { focusSession: { id: sessionId } },
    });

    if (!sessionEmotion) {
      throw new NotFoundException('Focus session emotions not found');
    }

    sessionEmotion.emotionAfter = emotionAfter;
    await this.focusSessionEmotionRepository.save(sessionEmotion);

    return session;
  }

  async getFocusSessionsByUser(userId: number): Promise<FocusSession[]> {
    return this.focusSessionsRepository.find({
      where: { user: { id: userId } },
      order: { startTime: 'DESC' },
    });
  }

  async getFocusSessionById(sessionId: number): Promise<FocusSession> {
    const session = await this.focusSessionsRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Focus session not found');
    return session;
  }
}
