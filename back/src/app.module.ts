import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MembersModule } from './members/members.module';
import { AppointmentsModule } from "./appointments/appointments.module";
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { RoutinesModule } from './routines/routines.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UsersModule, 
    RoutinesModule, 
    MembersModule, 
    AppointmentsModule, 
    PaymentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
