import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentsDto {
  @IsNotEmpty()
  @IsString()
  memberId: string;  // Relación con Member

  @IsNotEmpty()
  @IsDateString()
  date: string;

}