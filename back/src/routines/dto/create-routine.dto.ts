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
  
    @ApiProperty({example: 'ID del usuario'})
    @IsString()
    @IsNotEmpty()
    userId: string;
  
    @ApiProperty({
      type: [CreateRoutineExerciseDto],
      example: [
        {
          exerciseId: '161e9521-386f-49c1-bca5-91cc7a2b11ca',
          series: 3,
          repetitions: 13,
        },
      ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateRoutineExerciseDto)
    exercises: CreateRoutineExerciseDto[];
  }