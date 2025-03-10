import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentsDto } from './dtos/appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(data: CreateAppointmentsDto) {
    const { memberId, date, time, roomId } = data;
    // Verificar si el usuario tiene una membresía activa
    const member = await this.prisma.member.findUnique({
      where: { id: data.memberId },
    });

    if (!member || !member.isActive) {
      throw new ForbiddenException(
        'Debes tener una membresía activa para agendar una cita.',
      );
    }
    const membershipType = member.memberShipType;

    // Validar que la fecha esté dentro de los próximos 7 días
    const appointmentDate = new Date(data.date);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    if (appointmentDate < today || appointmentDate > maxDate) {
      throw new BadRequestException(
        'Solo puedes agendar turnos dentro de los próximos 7 días.',
      );
    }

    // Validar horarios según la membresía
    const hour = parseInt(time.split(':')[0]);
    if (membershipType === 'BASIC' && (hour < 8 || hour > 18)) {
      throw new BadRequestException(
        'Los usuarios BASIC solo pueden reservar entre 08:00 y 18:00.',
      );
    }

    // Validar que el usuario no tenga más turnos de los permitidos
    const existingAppointments = await this.prisma.appointment.findMany({
      where: { memberId, date },
    });

    if (membershipType === 'BASIC' && existingAppointments.length >= 1) {
      throw new BadRequestException(
        'Los usuarios BASIC solo pueden tener un turno por día.',
      );
    }

    if (
      (membershipType === 'PREMIUM' || membershipType === 'DIAMOND') &&
      existingAppointments.some((a) => a.roomId === roomId)
    ) {
      throw new BadRequestException(
        'Ya tienes un turno en esta sala para este día.',
      );
    }

    // //Convertir `date` de string a DateTime

    // if (isNaN(appointmentDate.getTime())) {
    //   throw new BadRequestException(
    //     'Fecha inválida, asegúrate de enviarla en formato ISO-8601.',
    //   );
    // }
    //Validar disponibilidad de la sala
    const roomAppointments = await this.prisma.appointment.count({
      where: { roomId, date, time },
    });

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Sala no encontrada.');
    }

    if (roomAppointments >= room.capacity) {
      throw new BadRequestException(
        'No hay más vacantes disponibles en esta sala para este horario.',
      );
    }
    // Verificar que no haya un turno en la misma fecha y hora
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        memberId: data.memberId,
        date: data.date,
        time: data.time,
      },
    });

    if (existingAppointment) {
      throw new BadRequestException(
        'Ya tienes un turno agendado para esta fecha y hora.',
      );
    }

    return this.prisma.appointment.create({
      data: { memberId, date, time, roomId },
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

  async updateAppointment(id: string, status: string) {
    const validStatuses = ['ACTIVED', 'CANCELED'];

    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Estado no válido.');
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { member: true },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada.');
    }

    // **Liberar cupo si se cancela**
    if (status === 'CANCELED') {
      await this.prisma.appointment.delete({ where: { id } });
      return { message: 'Cita cancelada y cupo liberado.' };
    }

    // **Actualizar estado de la cita**
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
