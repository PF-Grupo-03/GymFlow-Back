import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentsDto {
  @ApiProperty({example: '123e4567-e89b-12d3-a456-426614174000'})
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  memberId: string;  // Relación con Member

  @ApiProperty({example: '2023-03-01'})
  @IsNotEmpty()
  @IsDateString()
  date: string; // Nuevo campo para almacenar la fecha (ejemplo: "2023-03-01")

  @ApiProperty({example: '14:00'})
  @IsNotEmpty()
  @IsString()
  time: string; // Nuevo campo para almacenar la hora (ejemplo: "14:00")

}