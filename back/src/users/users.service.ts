import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private excludePassword(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

async getAllUsers() {
    const users = await this.prisma.user.findMany();

    if (!users.length)
      throw new NotFoundException(
        'Usuarios no encontrados',
      );

    return users.map(this.excludePassword);
    
}

async getUserById(id: string) {
  const user = await this.prisma.user.findUnique({
   where: {
    id: id,
   },});

  if (!user) throw new NotFoundException('Usuario no encontrado');
  return this.excludePassword(user);
}


async updateUser(id: string, updatedData: any) {
  const user = await this.prisma.user.update({
    where: { id },
    data: updatedData,
  });
  if (!user) throw new NotFoundException(`el usuario de id ${id} no existe`);
  return this.excludePassword(user);
}

async findUserByEmail(email: string) {
  return await this.prisma.user.findUnique({
    where: { email },
  });
}

}
