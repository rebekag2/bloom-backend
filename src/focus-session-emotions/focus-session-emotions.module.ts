import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusSessionEmotion } from 'src/entities/focus-session-emotion.entity';
import { FocusSessionEmotionsService } from './focus-session-emotions.service';
import { FocusSessionEmotionsController } from './focus-session-emotions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FocusSessionEmotion])],  
  providers: [FocusSessionEmotionsService],
  controllers: [FocusSessionEmotionsController],
})
export class FocusSessionEmotionsModule {}
