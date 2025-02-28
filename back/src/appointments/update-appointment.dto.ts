import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class UpdateAppointmentStatusDto {

  @ApiProperty({example: 'ACTIVED or CANCELED'})  
  @IsString()
  @IsIn(['ACTIVED', 'CANCELED'], { message: 'Estado no válido. Solo se permite ACTIVED o CANCELED.' })
  status: string;
}