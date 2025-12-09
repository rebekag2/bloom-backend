import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { FocusSessionsService } from './focus-sessions.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Focus Sessions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('focus-sessions')
export class FocusSessionsController {
  constructor(private readonly focusSessionsService: FocusSessionsService) {}

  @Post(':userId')
  async createFocusSession(
    @Param('userId') userId: number,
    @Body() body: { startTime: Date; endTime: Date; durationMinutes: number },
  ) {
    return this.focusSessionsService.createFocusSession(
      userId,
      new Date(body.startTime),
      new Date(body.endTime),
      body.durationMinutes,
    );
  }

  @Get(':userId')
  async getUserFocusSessions(@Param('userId') userId: number) {
    return this.focusSessionsService.getFocusSessionsByUser(userId);
  }

  @Get('/session/:id')
  async getFocusSessionDetails(@Param('id') sessionId: number) {
    return this.focusSessionsService.getFocusSessionById(sessionId);
  }

  @Patch('/session/:id')
  async cancelFocusSession(@Param('id') sessionId: number) {
    return this.focusSessionsService.cancelFocusSession(sessionId);
  }
}
