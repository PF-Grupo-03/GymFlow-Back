import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TrainerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const foundUser = await this.prisma.users.findUnique({ where: { id: user.id } });
    if (!foundUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (foundUser.role === 'USER_ADMIN') {
      return true;
    }

    if (foundUser.role !== 'USER_TRAINING') {
      throw new UnauthorizedException('El usuario no tiene el rol de entrenador');
    }

    if (!foundUser.approved) {
      throw new UnauthorizedException('Entrenador no aprobado');
    }

    return true;
  }
}
