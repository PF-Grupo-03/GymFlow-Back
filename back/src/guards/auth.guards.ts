import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'No se ha proporcionado un encabezado de autenticación.',
      );
    }

    // Dividimos el encabezado para extraer el token.
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException(
        'El token de autenticación no es válido.',
      );
    }

    const token = parts[1];

    try {
      // Verifcamos el token.
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error(
          'JWT_SECRET no está definido en las variables de entorno.',
        );
      }
      const user = this.jwtService.verify(token, { secret });
      // Converrtimos las fechas a objetos Date.
      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);

      user.roles = [user.role]

      console.log('AuthGuard - Token decodificado:', user);

      // Añadimos el usuario a la petición.
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'El token de autenticación no es válido.',
      );
    }
  }
}
