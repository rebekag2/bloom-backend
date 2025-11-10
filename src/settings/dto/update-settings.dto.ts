import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Define enum for days of the week
export enum DaysOfWeek {
  Luni = 'Luni',
  Marti = 'Marți',
  Miercuri = 'Miercuri',
  Joi = 'Joi',
  Vineri = 'Vineri',
  Sambata = 'Sâmbătă',
  Duminica = 'Duminică',
}

export class UpdateSettingsDto {
  @ApiPropertyOptional({ description: 'Enable or disable notification sound' })
  @IsOptional()
  @IsBoolean()
  notificationSound?: boolean;

  @ApiPropertyOptional({
    description: 'First day of the week',
    enum: DaysOfWeek,
  })
  @IsOptional()
  @IsEnum(DaysOfWeek)
  firstDayOfWeek?: DaysOfWeek;

  @ApiPropertyOptional({
    description: 'Default focus time in minutes (minimum 1)',
    minimum: 1,
    type: 'integer',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultFocusTime?: number;
}
