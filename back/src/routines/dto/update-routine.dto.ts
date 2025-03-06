import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateRoutineExerciseDto } from './createRoutineExercise.dto';

export class UpdateRoutineDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineExerciseDto)
  exercises: CreateRoutineExerciseDto[];
}