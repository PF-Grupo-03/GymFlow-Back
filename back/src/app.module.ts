import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MembersModule } from './members/members.module';
import { AppointmentsModule } from "./appointments/appointments.module";
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [UsersModule, MembersModule, AppointmentsModule, PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
