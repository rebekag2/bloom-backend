import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsBoolean()
  notificationSound?: boolean;

  @IsOptional()
  @IsEnum(['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'])
  firstDayOfWeek?: 'Luni' | 'Marți' | 'Miercuri' | 'Joi' | 'Vineri' | 'Sâmbătă' | 'Duminică';

  @IsOptional()
  @IsInt()
  @Min(1)
  defaultFocusTime?: number;
}
