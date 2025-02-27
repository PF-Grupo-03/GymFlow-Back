import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/users.dto';
import { loginUserDto } from 'src/users/dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    const formattedBDate = new Date(user.bDate);
    if (isNaN(formattedBDate.getTime())) {
      throw new BadRequestException(
        'La fecha de nacimiento debe ser una fecha valida',
      );
    }

    const { confirmPassword, ...newUser } = user;

    return this.authService.signup(newUser);
  }

  @Post('signin')
  async signin(@Body() loginUser: loginUserDto) {
    const { email, password } = loginUser;
    const token = await this.authService.signin(email, password);
    if (!token) {
      throw new BadRequestException('La contraseña o el email son incorrectos');
    }

    return { message: 'Inicio de sesión con éxito', token };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Este endpoint redirige al usuario a Google
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return {
      message: 'User authenticated with Google',
      user: req.user,
    };
  }
}
