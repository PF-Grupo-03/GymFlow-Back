import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UserRole } from 'src/roles.enum';
import { MatchPassword } from 'src/Utils/matchPassword';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nameAndLastName: string;

  @ApiProperty({ example: 'juanperez@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ab345678!' })
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty({ example: 'Ab345678!' })
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @ApiProperty({ example: '1999-01-01' })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value)) // Convierte el string a Date
  bDate: Date;

  @ApiProperty({ example: 'Av. Juan XXIII, 123' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  address: string;

  @ApiProperty({ example: '+541112345678' })
  @IsString()
  @Matches(/^\+?\d{7,15}$/, {
    message:
      'El teléfono debe contener solo números y puede incluir un "+" al inicio',
  })
  phone: string;

  @ApiProperty({ example: 'USER_MEMBER' })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'false' })
  @IsBoolean()
  approved: boolean;

  // @IsOptional()
  // @IsEnum(['basic', 'premium', 'diamont'])
  // membershipType?: 'basic' | 'premium' | 'diamont';
}
