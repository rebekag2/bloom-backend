import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { FocusSessionsService } from './focus-sessions.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { Request } from 'express';

import {
  CancelFocusSessionDto,
  CreateFocusSessionDto,
  FinishFocusSessionDto,
} from './dto/focus-session.dto';

@ApiTags('Focus Sessions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('focus-sessions')
export class FocusSessionsController {
  constructor(private readonly focusSessionsService: FocusSessionsService) {}

  // ======================
  // START
  // ======================
  @Post('start')
  async startSession(
    @Req() req: Request,
    @Body() body: CreateFocusSessionDto,
  ) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new NotFoundException('Unauthorized');

    return this.focusSessionsService.startFocusSession(
      userId,
      body.durationMinutes,
      body.emotionBeforeId,
    );
  }

  // ======================
  // CANCEL
  // ======================
  @Patch('session/:id/cancel')
  async cancelSession(
    @Req() req: Request,
    @Param('id') sessionId: number,
    @Body() body: CancelFocusSessionDto,
  ) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new NotFoundException('Unauthorized');

    return this.focusSessionsService.cancelFocusSession(
      sessionId,
      body.focusedMinutes,
    );
  }

  // ======================
  // FINISH
  // ======================
  @Patch('session/:id/finish')
  async finishSession(
    @Req() req: Request,
    @Param('id') sessionId: number,
    @Body() body: FinishFocusSessionDto,
  ) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new NotFoundException('Unauthorized');

    return this.focusSessionsService.finishFocusSession(
      sessionId,
      body.emotionAfterId,
    );
  }

  // ======================
  // SUMMARY (DASHBOARD)
  // ======================
  @Get('summary')
  async getSummary(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new NotFoundException('Unauthorized');

    return this.focusSessionsService.getUserSummary(userId);
  }

  // ======================
  // HISTORY WITH EMOTIONS
  // ======================
  @Get('with-emotions')
  async getSessionsWithEmotions(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new NotFoundException('Unauthorized');

    return this.focusSessionsService.getSessionsWithEmotions(userId);
  }

  // ======================
  // BASIC FETCHES
  // ======================
  @Get()
  async getUserSessions(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new NotFoundException('Unauthorized');

    return this.focusSessionsService.getFocusSessionsByUser(userId);
  }

  @Get('session/:id')
  async getSessionDetails(@Param('id') sessionId: number) {
    return this.focusSessionsService.getFocusSessionById(sessionId);
  }
}