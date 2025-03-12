import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
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
    return { message: 'Redirigiendo a Google para autenticación...' };
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    console.log('Usuario autenticado:', req.user);

    // Extraemos el usuario de req.user
    const { user: userData } = req.user;
    console.log('Datos del usuario:', userData);

    const userId = userData.id;

    // Verificar si el usuario tiene los datos completos
    const hasCompleteProfile =
      userData.dni && userData.phone && userData.address && userData.bDate;

    if (hasCompleteProfile) {
      return res.redirect(`https://gym-flow-front.vercel.app`);
    } else {
      return res.redirect(
        `https://gym-flow-front.vercel.app/CompletarPerfil?id=${userId}`,
      );
    }
  }
}
