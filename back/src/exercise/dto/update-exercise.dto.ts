import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { Musclues } from "src/enum/musclues.enum";

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

}