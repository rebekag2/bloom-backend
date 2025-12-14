import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusSession } from 'src/entities/focus-session.entity';
import { FocusSessionsService } from './focus-sessions.service';
import { FocusSessionsController } from './focus-sessions.controller';
import { Setting } from 'src/entities/settings.entity';
import { FocusSessionEmotion } from 'src/entities/focus-session-emotion.entity';
import { Emotion } from 'src/entities/emotions.entity';

@Module({
  imports: [   TypeOrmModule.forFeature([FocusSession, FocusSessionEmotion, Emotion]),],
  providers: [FocusSessionsService],
  controllers: [FocusSessionsController],
  exports: [FocusSessionsService],
})
export class FocusSessionsModule {}
