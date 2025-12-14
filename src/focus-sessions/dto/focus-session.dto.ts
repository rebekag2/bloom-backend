import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

// create-focus-session.dto.ts
export class CreateFocusSessionDto {
   @ApiProperty({ example: 25, description: 'Focus session duration in minutes' })
  durationMinutes: number;

  @ApiProperty({ example: 12, description: 'ID of the emotion before starting the session' })
  emotionBeforeId: number;
}

// finish-focus-session.dto.ts
export class FinishFocusSessionDto {
  @ApiProperty({ example: 14, description: 'ID of the emotion after finishing the session' })
  emotionAfterId: number;
}

// cancel-focus-session.dto.ts
  export class CancelFocusSessionDto {
  @ApiProperty({ example: 12, description: 'Minutes actually focused before cancel' })
    @IsInt()
    @Min(0)
    focusedMinutes: number;
  }
