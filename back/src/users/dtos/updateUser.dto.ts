import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, Matches, Length } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({example: '12345678'})
    @IsString()
    @Matches(/^\d{7,8}$/, {
        message: 'El DNI debe contener entre 7 y 8 dígitos numéricos',
      })
    dni: string;

    @ApiProperty({example: 'Calle 123'})
    @IsString()
    @Length(3, 80)
    address: string;

    @ApiProperty({example: '+541112345678'})
    @IsString()
    @Matches(/^\+?\d{7,15}$/, {
        message:
          'El teléfono debe contener solo números y puede incluir un "+" al inicio',
      })
    phone: string;

    @IsOptional()
    @IsBoolean()
    approved?: boolean;
}
