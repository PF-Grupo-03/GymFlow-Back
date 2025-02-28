import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentsDto } from './appointments.dto';


@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(data: CreateAppointmentsDto) {
    // Verificar si el usuario tiene una membresía activa
    const member = await this.prisma.member.findUnique({
      where: { id: data.memberId },
    });

    if (!member || !member.isActive) {
      throw new ForbiddenException('Debes tener una membresía activa para agendar una cita.');
    }

  //   // Convertir `date` de string a DateTime
  //   const appointmentDate = new Date(data.date);
  //   if (isNaN(appointmentDate.getTime())) {
  //   throw new BadRequestException('Fecha inválida, asegúrate de enviarla en formato ISO-8601.');
  // }

    // Verificar que no haya un turno en la misma fecha y hora
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        memberId: data.memberId,
        date: data.date,
        time: data.time,
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('Ya tienes un turno agendado para esta fecha y hora.');
    }

    return this.prisma.appointment.create({
      data,
      include: { member: { include: { user: true } } },
    });
  }

  async findAll(memberId: string) {
    return this.prisma.appointment.findMany({
      where: { memberId }, // Filtrar por el ID del miembro
      include: { member: { include: { user: true } } },
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
    const validStatuses = ['ACTIVED', 'CANCELED'];

    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Estado no válido.');
    }

    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
