import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsDto } from './dtos/appointments.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateAppointmentStatusDto } from './dtos/update-appointment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guards';
import { RolesGuard } from 'src/guards/roles.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { UserRole } from 'src/enum/roles.enum';

@Controller('appointments')
export class AppointmentsController {
  attendanceService: any;
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.USER_BASIC,
    UserRole.USER_PREMIUM,
    UserRole.USER_DIAMOND,
    UserRole.USER_ADMIN,
  )
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentsDto) {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  @ApiBearerAuth()
  @Get(':memberId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.USER_BASIC,
    UserRole.USER_PREMIUM,
    UserRole.USER_DIAMOND,
    UserRole.USER_ADMIN,
  )
  findAll(@Param('memberId') memberId: string) {
    return this.appointmentsService.findAll(memberId);
  }

  @ApiBearerAuth()
  @Get('appointment/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.USER_BASIC,
    UserRole.USER_PREMIUM,
    UserRole.USER_DIAMOND,
    UserRole.USER_ADMIN,
  )
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.USER_BASIC,
    UserRole.USER_PREMIUM,
    UserRole.USER_DIAMOND,
    UserRole.USER_ADMIN,
  )
  updateAppointmentStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateAppointment(
      id,
      updateAppointmentStatusDto.status,
    );
  }

  @Get(':id/qr')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.USER_BASIC,
    UserRole.USER_PREMIUM,
    UserRole.USER_DIAMOND,
    UserRole.USER_ADMIN,
  )
  async generateQr(@Param('id') id: string) {
    return this.attendanceService.generateQr(id);
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
