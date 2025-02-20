import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches, MaxLength, MinLength, Validate } from "class-validator";
import { MatchPassword } from "src/Utils/matchPassword";

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @IsNotEmpty()
  @IsDate()
  @IsString()
  bDate: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  address: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;
}

export class loginUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  @MinLength(8)
  @MaxLength(20)
  password: string;
}