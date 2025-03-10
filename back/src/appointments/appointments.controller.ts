import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsDto } from './dtos/appointments.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateAppointmentStatusDto } from './dtos/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentsDto) {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  @Get(':memberId')
  findAll(@Param('memberId') memberId: string) {
    return this.appointmentsService.findAll(memberId);
  }

  @Get('appointment/:id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  updateAppointmentStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateAppointment(
      id,
      updateAppointmentStatusDto.status,
    );
  }
}

// @Controller('appointments')
// export class AppointmentsController {
//   constructor(private readonly appointmentsService: AppointmentsService, private readonly prisma: PrismaService) {}

//   @Post()
//   async createAppointment(@Body() createAppointmentDto: CreateAppointmentsDto) {
//     const member = await this.prisma.member.findUnique({
//       where: { id: createAppointmentDto.memberId },
//     });

//     if (!member || !member.isActive) {
//       throw new ForbiddenException('Debes tener una membresía activa para agendar una cita.');
//     }

//     return this.appointmentsService.createAppointment(createAppointmentDto);
//   }

//   @Get()
//   findAll() {
//     return this.appointmentsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.appointmentsService.findOne(id);
//   }

//   @Patch(':id/status')
//   async updateAppointmentStatus(
//     @Param('id') id: string,
//     @Body('status') status: string,
//   ) {
//     return this.appointmentsService.updateAppointmentStatus(id, status);
//   }
// }
