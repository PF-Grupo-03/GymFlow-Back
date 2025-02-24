import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentsDto } from './appointments.dto';


@Injectable()
export class AppointmentsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateAppointmentsDto) {
        return this.prisma.appointment.create({
          data,
          include: { member: { include: { user: true } } }, // Incluir datos del usuario a través del miembro
        });
      }

      async findAll() {
        return this.prisma.appointment.findMany({
          include: { member: { include: { user: true } } }, // Incluir usuario
        });
      }

      async findOne(id: string) {
        const appointment = await this.prisma.appointment.findUnique({
          where: { id },
          include: { member: { include: { user: true } } },
        });
        if (!appointment) throw new NotFoundException('Turno no encontrado');
        return appointment;
      }

      async remove(id: string) {
        return this.prisma.appointment.delete({ where: { id } });
      }
}
