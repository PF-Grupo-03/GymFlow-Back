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
import { GoogleDto } from './google.dto';

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
  async googleAuth(googleDto: GoogleDto) {
    return this.authService.validateOrCreateGoogleUser(googleDto);
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;

    const userId = req.user.user.id;

    // Verificar si el usuario tiene los datos completos
    const hasCompleteProfile =
      user.dni && user.phone && user.address && user.bDate;

    if (hasCompleteProfile) {
      return res.redirect(
        `https://gym-flow-front.vercel.app/MyAccount?id=${userId}`,
      );
    } else {
      return res.redirect(
        `https://gym-flow-front.vercel.app/CompletarPerfil?id=${userId}`,
      );
    }
  }
}
