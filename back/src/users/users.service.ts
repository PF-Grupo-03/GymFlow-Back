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

  private excludePassword(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, confirmPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers() {
    const users = await this.prisma.users.findMany();

    if (!users.length) throw new NotFoundException('Usuarios no encontrados');

    const userMap = users.map((user) => this.excludePassword(user));
    return userMap;
  }

  async getUserById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, updatedData: Partial<CreateUserDto>) {
    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: updatedData,
        include: { member: true },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
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
    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.role !== 'USER_TRAINING') {
      throw new BadRequestException(
        'Solo los entrenadores pueden ser aprobados',
      );
    }

    return this.prisma.users.update({
      where: { id: userId },
      data: { approved: dto.approved },
    });
  }
}
