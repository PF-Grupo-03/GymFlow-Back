import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/users.dto';
import { ApproveTrainerDto } from './dtos/approveTrainer.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private excludePassword(user: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers() {
    const users = await this.prisma.users.findMany({
      include: { member: true },
    });

    if (!users.length) throw new NotFoundException('Usuarios no encontrados');

    return users.map(this.excludePassword);
  }

  async getUserById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: id,
      },
      include: { member: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.excludePassword(user);
  }

  async updateUser(id: string, updatedData: Partial<CreateUserDto>) {
    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: updatedData,
        include: { member: true },
      });

      return this.excludePassword(user);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`El usuario con ID ${id} no existe`);
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async findUserByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: { email },
      include: { member: true },
    });
  }

  async approveTrainer(userId: string, dto: ApproveTrainerDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.UserRole !== 'USER_TRAINING') {
      throw new BadRequestException(
        'Solo los entrenadores pueden ser aprobados',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { approved: dto.approved },
    });
  }
}
