import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { CreateRoutineExerciseDto } from './createRoutineExercise.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AddExercisesDto {
    @ApiProperty({example: 'ID de la rutina'})
    @IsUUID()
    @IsNotEmpty()
    routineId: string;

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
