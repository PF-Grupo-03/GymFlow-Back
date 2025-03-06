import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, IsString, Max, Min } from "class-validator";

export class CreateRoutineExerciseDto {
    @IsString()
    @IsNotEmpty()
    exerciseId: string;
  
    @ApiProperty({ example: 3 })
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    @Max(10)
    series: number;
  
    @ApiProperty({ example: 13 })
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    @Max(20)
    repetitions: number;
  }