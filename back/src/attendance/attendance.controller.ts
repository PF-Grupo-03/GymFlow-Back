import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from 'src/guards/auth.guards';
import { RolesGuard } from 'src/guards/roles.guards';
import { UserRole } from 'src/enum/roles.enum';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('generate-qr/:appointmentId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.USER_BASIC,
    UserRole.USER_PREMIUM,
    UserRole.USER_DIAMOND,
    UserRole.USER_ADMIN,
  )
  async generateQR(@Param('appointmentId') appointmentId: string) {
    return this.attendanceService.generateQR(appointmentId);
  }

  @Post('check-in')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_TRAINING)
  async checkIn(@Body('token') token: string) {
    return this.attendanceService.registerAttendance(token);
  }

  @Get('user-attendance/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_ADMIN, UserRole.USER_TRAINING)
  async getUserAttendance(@Param('userId') userId: string) {
    return this.attendanceService.getUserAttendance(userId);
  }

  @Get('stats')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_ADMIN)
  async getAttendanceStats() {
    return this.attendanceService.getAttendanceStats();
  }
}
