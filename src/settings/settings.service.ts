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

  // 🟢 Get settings for a specific user
  async getUserSettings(userId: number): Promise<Setting> {
    const settings = await this.settingsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!settings) {
      throw new NotFoundException('Settings not found for this user');
    }

    return settings;
  }

  async saveUserSettings(userId: number, data: Partial<Setting>): Promise<Setting> {
    let settings = await this.settingsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (settings) {
      // update existing settings
      Object.assign(settings, data);
    } else {
      // create new settings entry
      settings = this.settingsRepository.create({
        ...data,
        user: { id: userId } as User,
      });
    }

    return await this.settingsRepository.save(settings);
  }
}
