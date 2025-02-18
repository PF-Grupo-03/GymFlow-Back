import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MembershipModule } from './membership/membership.module';
import { PaymentModule } from './payment/payment.module';
import { RoutineModule } from './routine/routine.module';

@Module({
  imports: [UsersModule, AuthModule, AppointmentModule, MembershipModule, PaymentModule, RoutineModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
