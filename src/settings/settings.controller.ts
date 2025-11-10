import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from 'src/entities/settings.entity';
import { ApiBody, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 
import { UpdateSettingsDto } from './dto/update-settings.dto';

@ApiTags('Settings')
// @ApiBearerAuth()            // Adds the lock icon in Swagger UI (token required)
// @UseGuards(JwtAuthGuard)    // Protects all routes in this controller
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':userId')
  async getUserSettings(@Param('userId') userId: number): Promise<Setting> {
    return await this.settingsService.getUserSettings(userId);
  }

  @Post(':userId')
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: UpdateSettingsDto })
  async saveSettings(@Param('userId') userId: number, @Body() settingsData: UpdateSettingsDto) {
    return this.settingsService.saveUserSettings(userId, settingsData as Partial<Setting>);
  }
}
