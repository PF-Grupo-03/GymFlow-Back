import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { MembershipsModule } from './memberships/memberships.module';
import { RoutinesModule } from './routines/routines.module';

@Module({
  imports: [AuthModule, AppointmentsModule, UsersModule, PaymentsModule, MembershipsModule, RoutinesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
