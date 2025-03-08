import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { DayOfWeek } from 'src/enum/day.enum';
import { CreateRoutineExerciseDto } from './createRoutineExercise.dto';

export class CreateRoutineDto {
    @ApiProperty({example: 'Lunes', enum: DayOfWeek})
    @IsEnum(DayOfWeek)
    @IsNotEmpty()
    day: DayOfWeek;
  
    @IsString()
    @IsNotEmpty()
    userId: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateRoutineExerciseDto)
    exercises: CreateRoutineExerciseDto[];
  }