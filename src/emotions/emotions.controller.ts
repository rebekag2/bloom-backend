import { Controller, Get, UseGuards } from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { Emotion } from 'src/entities/emotions.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('emotions')
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}


  // @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(): Promise<Emotion[]> {
    return this.emotionsService.findAll();
  }
}
