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

  // Create session when user clicks start timer (with emotionBefore)
  async startFocusSession(
    userId: number,
    durationMinutes: number,
    emotionBeforeId: number,
  ): Promise<FocusSession> {
    const now = new Date();

    // Create session with no endTime yet, canceled false
    const session = this.focusSessionsRepository.create({
      user: { id: userId } as User,
      startTime: now,
      endTime: null,
      durationMinutes,
      canceled: false,
    });
    const savedSession = await this.focusSessionsRepository.save(session);

    // Link emotionBefore
    const emotionBefore = await this.emotionRepository.findOneBy({ id: emotionBeforeId });
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

async cancelFocusSession(sessionId: number, focusedMinutes: number): Promise<FocusSession> {
  const session = await this.focusSessionsRepository.findOne({
    where: { id: sessionId },
  });
  if (!session) throw new NotFoundException('Focus session not found');

  session.canceled = true;
  session.endTime = new Date();
  session.durationMinutes = focusedMinutes; // Update duration with actual focused time

  return this.focusSessionsRepository.save(session);
}

  // Finish session normally and add emotionAfter
  async finishFocusSession(
    sessionId: number,
    emotionAfterId: number,
  ): Promise<FocusSession> {
    const session = await this.focusSessionsRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Focus session not found');

    const emotionAfter = await this.emotionRepository.findOneBy({ id: emotionAfterId });
    if (!emotionAfter) throw new NotFoundException('Emotion after session not found');

    session.endTime = new Date();
    session.canceled = false;

    // Update session
    await this.focusSessionsRepository.save(session);

    // Update the FocusSessionEmotion for this session - add emotionAfter
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
    if (!session) {
      throw new NotFoundException('Focus session not found');
    }
    return session;
  }
}
