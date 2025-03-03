import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/users.dto';
import { ApproveTrainerDto } from './dtos/approveTrainer.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

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
    const user = await this.prisma.users.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
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


  async updateUserAuthGoogle(id: string, updatedData: Partial<UpdateUserDto>) {
    
    try {
      const user = await this.prisma.users.findUnique({ where: { id } });
  
      if (!user) {
        throw new NotFoundException(`El usuario con ID ${id} no existe`);
      }
    
      // Verificar si otro usuario ya tiene el mismo número de teléfono
      if (updatedData.phone && updatedData.phone !== user.phone) {
        const existingPhoneUser = await this.prisma.users.findFirst({
          where: {
            phone: updatedData.phone,
            id: { not: id }, // Excluir el usuario actual
          },
        });
  
        if (existingPhoneUser) {
          throw new BadRequestException(
            `El teléfono ${updatedData.phone} ya está en uso por otro usuario`
          );
        }
      }
  
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: {
          ...updatedData,
          approved: true, // Asegurar que el usuario quede aprobado
        },
      });
  
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    
    } catch (error) {
      
      if (error instanceof BadRequestException) {
        throw error; // Si es un error esperado, lo dejamos pasar tal cual
      }  
      throw new InternalServerErrorException('Error inesperado al actualizar el usuario');
    }
  }
  
  
  
}
