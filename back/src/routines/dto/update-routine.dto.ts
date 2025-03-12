import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateRoutineExerciseDto } from './createRoutineExercise.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoutineDto {

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