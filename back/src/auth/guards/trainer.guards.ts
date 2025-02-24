import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class TrainerGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const foundUser = await this.prisma.users.findUnique({ where: { id: user.id } });

    return foundUser.role === 'USER_TRAINING' && foundUser.approved;
  }
}
