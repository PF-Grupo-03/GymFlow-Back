import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { CreateRoutineExerciseDto } from './createRoutineExercise.dto';

export class AddExercisesDto {
    @IsUUID()
    @IsNotEmpty()
    routineId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateRoutineExerciseDto)
    exercises: CreateRoutineExerciseDto[];

}
