import { ApiProperty } from "@nestjs/swagger";
import { Musclues } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateExerciseDto {
    @ApiProperty({example: 'Press de banca con mancuernas'})
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({example: 'Pecho'})
    @IsEnum(Musclues)
    @IsOptional()
    musclue?: Musclues;

    @ApiProperty({example: 'https://url.example.gif'})
    @IsUrl()
    @IsOptional()
    gifUrl?: string;

    @ApiProperty({example: ['Explicación de la práctica 1', 'Explicación de la práctica 2']})
    @IsArray()
    @IsOptional()
    instructions?: string[];

}