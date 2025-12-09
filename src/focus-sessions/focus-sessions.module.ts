import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusSession } from 'src/entities/focus-session.entity';
import { FocusSessionsService } from './focus-sessions.service';
import { FocusSessionsController } from './focus-sessions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FocusSession])],
  providers: [FocusSessionsService],
  controllers: [FocusSessionsController],
  exports: [FocusSessionsService],
})
export class FocusSessionsModule {}
