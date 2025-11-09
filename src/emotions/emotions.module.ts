import { Module } from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { EmotionsController } from './emotions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emotion } from 'src/entities/emotions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Emotion])],
  providers: [EmotionsService],
  controllers: [EmotionsController],
  exports: [EmotionsService],
})
export class EmotionsModule {}
