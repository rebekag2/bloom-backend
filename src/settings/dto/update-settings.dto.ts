import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({example: true, description: 'Enable or disable notification sound' })
  @IsOptional()
  @IsBoolean()
  notificationSound?: boolean;

  @ApiProperty({
    example: 'Luni',
    description: 'First day of the week',
    enum: DaysOfWeek,
  })
  @IsOptional()
  @IsEnum(DaysOfWeek)
  firstDayOfWeek?: DaysOfWeek;

  @ApiProperty({
    example: 25 ,
    description: 'Default focus time in minutes (minimum 1)',
    minimum: 1,
    type: 'integer',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultFocusTime?: number;
}
