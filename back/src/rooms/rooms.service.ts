import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './rooms.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: createRoomDto.userId },
    });
    if (createRoomDto.type === 'FUNCIONAL') {
      if (!createRoomDto.userId) {
        throw new BadRequestException(
          'Para una sala FUNCIONAL, debe asignarse un profesor.',
        );
      }
      const user = await this.prisma.users.findUnique({
        where: { id: createRoomDto.userId },
      });
      if (!user || user.role !== 'USER_TRAINING') {
        throw new BadRequestException(
          'El profesor asignado debe tener el rol USER_TRAINING.',
        );
      }
    }
    const data: any = {
      name: createRoomDto.name,
      capacity: createRoomDto.capacity,
      day: createRoomDto.day,
      time: createRoomDto.time,
      type: createRoomDto.type,
      isDeleted: false,
      user: user ? { connect: { id: user.id } } : undefined,
    };

    return this.prisma.room.create({ data });
  }

  async findAll() {
    return this.prisma.room.findMany({
      where: { isDeleted: false },
    });
  }

  async findOneById(id: string) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Sala no encontrada');
    return room;
  }

  async findOneByName(name: string) {
    const room = await this.prisma.room.findFirst({ where: { name } });
    if (!room) throw new NotFoundException('Sala no encontrada');
    return room;
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto) {
    const existingRoom = await this.findOneById(id);
    const user = await this.prisma.users.findUnique({
      where: { id: updateRoomDto.userId },
    });
    if (updateRoomDto.type === 'FUNCIONAL') {
      if (!updateRoomDto.userId) {
        throw new BadRequestException(
          'Para una sala FUNCIONAL, debe asignarse un profesor.',
        );
      }

      if (!user || user.role !== 'USER_TRAINING') {
        throw new BadRequestException(
          'El profesor asignado debe tener el rol USER_TRAINING.',
        );
      }
    }
    const data: any = {
      name: updateRoomDto.name,
      capacity: updateRoomDto.capacity,
      day: updateRoomDto.day,
      time: updateRoomDto.time,
      type: updateRoomDto.type,
      user: user ? { connect: { id: user.id } } : undefined,
    };

    return this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async softDeleteRoom(id: string) {
    await this.findOneById(id);
    await this.prisma.room.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { message: `Sala con ID: ${id} eliminada con éxito.` };
  }
}
