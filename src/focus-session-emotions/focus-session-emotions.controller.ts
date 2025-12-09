import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { FocusSessionEmotionsService } from './focus-session-emotions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Focus Session Emotions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('focus-sessions/:id/emotions')
export class FocusSessionEmotionsController {
  constructor(private readonly focusSessionEmotionsService: FocusSessionEmotionsService) {}

  @Post()
  async addEmotions(
    @Param('id') focusSessionId: number,
    @Body() body: { emotionBeforeId: number; emotionAfterId: number },
  ) {
    return this.focusSessionEmotionsService.addEmotions(
      focusSessionId,
      body.emotionBeforeId,
      body.emotionAfterId,
    );
  }

  @Get()
  async getEmotions(@Param('id') focusSessionId: number) {
    return this.focusSessionEmotionsService.getEmotionsForSession(focusSessionId);
  }
}
