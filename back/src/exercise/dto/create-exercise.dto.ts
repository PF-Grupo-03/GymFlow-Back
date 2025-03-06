import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Max, Min } from "class-validator";
import { Musclues } from "src/enum/musclues.enum";

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
}