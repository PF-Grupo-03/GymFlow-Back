import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class CreateRoutineDto {

    @ApiProperty({example: 'Lunes'})
    @IsString()
    day: string;

    @ApiProperty({example: ['Pecho', 'Espalda', 'Abdomen']})
    @IsArray()
    @ArrayNotEmpty()
    categories: string[];

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true }) // Valida que cada ID de ejercicio sea un UUID
    exercises: string[];
}
