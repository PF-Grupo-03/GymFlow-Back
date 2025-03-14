import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsEnum,
  IsOptional,
  Max,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Musculación' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(20)
  capacity: number;

  @ApiProperty({ example: 'LUNES' })
  @IsNotEmpty()
  @IsString()
  @IsEnum([
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO',
  ])
  day: string;

  @ApiProperty({ example: '08:00' })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({ example: 'MUSCULACION' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['MUSCULACION', 'FUNCIONAL'])
  type: string;

  @ApiProperty({ example: 'uuid-del-usuario', required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateRoomDto {
  @ApiProperty({ example: 'Crossfit' })
  @IsString()
  name?: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  @Max(20)
  capacity?: number;

  @ApiProperty({ example: 'MARTES', required: false })
  @IsOptional()
  @IsString()
  @IsEnum([
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO',
  ])
  day?: string;

  @ApiProperty({ example: '09:30', required: false })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiProperty({ example: 'FUNCIONAL', required: false })
  @IsOptional()
  @IsString()
  @IsEnum(['MUSCULACION', 'FUNCIONAL'])
  type?: string;

  @ApiProperty({ example: 'uuid-del-usuario', required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
