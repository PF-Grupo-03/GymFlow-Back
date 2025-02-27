import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException } from '@nestjs/common';
import { AppointmentsService } from "./appointments.service"
import { CreateAppointmentsDto } from './appointments.dto';
import { PrismaService } from 'src/prisma.service';


@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService, private readonly prisma: PrismaService) {}

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentsDto) {
    const member = await this.prisma.member.findUnique({
      where: { id: createAppointmentDto.memberId },
    });
  
    if (!member || !member.isActive) {
      throw new ForbiddenException('Debes tener una membresía activa para agendar una cita.');
    }
  
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.appointmentsService.updateAppointmentStatus(id, status);
  }
}
