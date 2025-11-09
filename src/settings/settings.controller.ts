import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from 'src/entities/settings.entity';
import { UpdateSettingsDto } from './update-settings.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // 🟢 Get settings for a specific user
  @Get(':userId')
  async getUserSettings(@Param('userId') userId: number): Promise<Setting> {
    return await this.settingsService.getUserSettings(userId);
  }

  // 🟢 Create or update settings
  @Post(':userId')
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: UpdateSettingsDto })
  async saveSettings(@Param('userId') userId: number, @Body() settingsData: UpdateSettingsDto) {
    return this.settingsService.saveUserSettings(userId, settingsData as Partial<Setting>);
  }
}
