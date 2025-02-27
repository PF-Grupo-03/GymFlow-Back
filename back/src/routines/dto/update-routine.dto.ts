import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class UpdateRoutineDto {
  @IsOptional()
  @IsString()
  day?: string;

  @ApiProperty({example: ['Pierna', 'Gluteo']})
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  categories?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true }) // Valida que cada ID de ejercicio sea un UUID
  exercises?: string[];
}
