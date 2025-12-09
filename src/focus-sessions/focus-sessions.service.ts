import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FocusSession } from 'src/entities/focus-session.entity';
import { User } from 'src/entities/users.entity';

@Injectable()
export class FocusSessionsService {
  constructor(
    @InjectRepository(FocusSession)
    private readonly focusSessionsRepository: Repository<FocusSession>,
  ) {}

  async createFocusSession(userId: number, startTime: Date, endTime: Date, durationMinutes: number): Promise<FocusSession> {
    const session = this.focusSessionsRepository.create({
      user: { id: userId } as User,
      startTime,
      endTime,
      durationMinutes,
      canceled: false,
    });

    return this.focusSessionsRepository.save(session);
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

  async cancelFocusSession(sessionId: number): Promise<FocusSession> {
    const session = await this.getFocusSessionById(sessionId);
    session.canceled = true;
    return this.focusSessionsRepository.save(session);
  }
}
