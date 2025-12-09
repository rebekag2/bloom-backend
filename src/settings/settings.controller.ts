import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from 'src/entities/settings.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@ApiTags('Settings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':userId')
  async getUserSettings(@Param('userId') userId: number): Promise<Setting> {
    return this.settingsService.getUserSettings(userId);
  }

  @Put(':userId')
  async updateUserSettings(
    @Param('userId') userId: number,
    @Body() settingsData: UpdateSettingsDto,
  ) {
    return this.settingsService.updateUserSettings(userId, settingsData);
  }
}
