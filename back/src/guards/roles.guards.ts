import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '.././decorators/roles.decorators';
import { UserRole } from 'src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificamos que exista el usuario y sus roles.
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException(
        'Usted no tiene los permisos necesarios para acceder a esta ruta',
      );
    }

    if (user.roles.includes(UserRole.USER_ADMIN)) {
      return true;
    }

    // Obtiene los roles requeridos definidos en la metadata.
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no se han definido roles requeridos, permite el acceso..
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Verificamos si el usuario posee alguno de los roles requeridos.
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        'Usted no tiene los permisos necesarios para acceder a esta ruta',
      );
    }

    return true;
  }
}
