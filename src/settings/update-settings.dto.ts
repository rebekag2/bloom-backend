import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsBoolean()
  notification_sound?: boolean;

  @IsOptional()
  @IsEnum(['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'])
  first_day_of_week?: string;

  @IsOptional()
  @IsInt()
  default_focus_time?: number;
}
