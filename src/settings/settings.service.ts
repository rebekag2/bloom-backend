import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Setting } from 'src/entities/settings.entity';
import { User } from 'src/entities/users.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepository: Repository<Setting>,
  ) {}

  async getUserSettings(userId: number): Promise<Setting> {
    const settings = await this.settingsRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!settings) {
      throw new NotFoundException('Settings not found for this user');
    }

    return settings;
  }

  async createDefaultSettingsForUser(user: User): Promise<Setting> {
    const settings = this.settingsRepository.create({
      user,
      notificationSound: true,
      firstDayOfWeek: 'Luni',
      defaultFocusTime: 25,
    });

    return await this.settingsRepository.save(settings);
  }

  async updateUserSettings(
    userId: number,
    data: Partial<Setting>,
  ): Promise<Setting> {
    const settings = await this.settingsRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    Object.assign(settings, data);
    return await this.settingsRepository.save(settings);
  }
}
