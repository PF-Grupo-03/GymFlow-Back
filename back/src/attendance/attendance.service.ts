import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

interface DecodedToken {
  appointmentId: string;
  userId: string;
  date: string;
  time: string;
}

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async generateQR(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { member: { include: { user: true } } },
    });

    if (!appointment) {
      throw new NotFoundException('Turno no encontrado.');
    }

    const secret = process.env.QR_SECRET;
    const token = jwt.sign(
      {
        appointmentId: appointment.id,
        userId: appointment.member.user.id,
        date: appointment.date,
        time: appointment.time,
      },
      secret,
      { expiresIn: '10m' },
    );

    return QRCode.toDataURL(token);
  }

  async checkAttendance(appointmentId: string): Promise<boolean> {
    const attendance = await this.prisma.attendance.findFirst({
      where: { appointmentId },
    });
    return !!attendance;
  }

  async registerAttendance(token: string) {
    const secret = process.env.QR_SECRET;
    let decoded: DecodedToken;

    try {
      decoded = jwt.verify(token, secret) as DecodedToken;
    } catch {
      throw new BadRequestException('QR inválido o expirado.');
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: decoded.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Turno no encontrado.');
    }

    const now = new Date();
    const appointmentDateTime = new Date(`${decoded.date}T${decoded.time}`);
    const fiveMinBefore = new Date(appointmentDateTime);
    fiveMinBefore.setMinutes(fiveMinBefore.getMinutes() - 5);
    const fiveMinAfter = new Date(appointmentDateTime);
    fiveMinAfter.setMinutes(fiveMinAfter.getMinutes() + 5);

    if (now < fiveMinBefore || now > fiveMinAfter) {
      throw new BadRequestException('QR no válido en este horario.');
    }

    if (await this.checkAttendance(decoded.appointmentId)) {
      throw new BadRequestException('El turno ya fue marcado como presente.');
    }

    await this.prisma.attendance.create({
      data: {
        appointmentId: decoded.appointmentId,
        userId: decoded.userId,
      },
    });
  }
  async getUserAttendance(userId: string) {
    return this.prisma.attendance.count({
      where: { appointment: { member: { userId } } },
    });
  }

  async getAttendanceStats() {
    return this.prisma.attendance.groupBy({
      by: ['appointmentId'],
      _count: { _all: true },
    });
  }
}
