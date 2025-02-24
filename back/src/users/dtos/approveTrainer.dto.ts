import { IsBoolean } from 'class-validator';

export class ApproveTrainerDto {
  @IsBoolean()
  approved: boolean;
}
