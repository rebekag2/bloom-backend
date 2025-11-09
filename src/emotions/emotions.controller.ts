import { Controller, Get } from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { Emotion } from 'src/entities/emotions.entity';

@Controller('emotions')
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @Get()
  getAll(): Promise<Emotion[]> {
    return this.emotionsService.findAll();
  }
}
