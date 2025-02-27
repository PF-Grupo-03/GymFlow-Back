import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentsDto } from './appointments.dto';


@Injectable()
export class AppointmentsService {
    constructor(private readonly prisma: PrismaService) {}

    async createAppointment(data: CreateAppointmentsDto) {
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

      async updateAppointmentStatus(id: string, status: string) {
        // Lista de estados válidos
        const validStatuses = ['ACTIVED', 'CANCELED'];
    
        if (!validStatuses.includes(status)) {
          throw new BadRequestException('Estado no válido.');
        }
    
        // Buscar la cita por ID
        const appointment = await this.prisma.appointment.findUnique({
          where: { id },
        });
    
        if (!appointment) {
          throw new NotFoundException('Cita no encontrada.');
        }
    
        // Actualizar el estado de la cita
        return this.prisma.appointment.update({
          where: { id },
          data: { status },
        });
      }
}
