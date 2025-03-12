import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ApproveTrainerDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  approved: boolean;
}
