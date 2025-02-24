import { Module } from '@nestjs/common';
import { AppointmentsService } from "./appointments.service";
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
