import { ApiProperty } from "@nestjs/swagger";
import { Musclues } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateExerciseDto {

    @ApiProperty({example: 'Press de banca con mancuernas'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: "PECHO"})
    @IsEnum(Musclues)
    @IsNotEmpty()
    musclue: Musclues;

    @ApiProperty({example: "https://url.example.gif"})
    @IsOptional()
    @IsUrl()
    gifUrl?: string;

    @ApiProperty({example: ['Explicación de la práctica 1', 'Explicación de la práctica 2']})
    @IsArray()
    @IsOptional()
    instructions: string[];

}