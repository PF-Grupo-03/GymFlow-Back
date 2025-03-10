import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './rooms.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(data: CreateRoomDto) {
    return this.prisma.room.create({ data });
  }

  async findAll() {
    return this.prisma.room.findMany();
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

  async updateRoom(id: string, data: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async deleteRoom(id: string) {
    await this.findOneById(id);
    return this.prisma.room.delete({ where: { id } });
  }
}
