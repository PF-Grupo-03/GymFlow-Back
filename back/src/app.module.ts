import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MembersModule } from './members/members.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { RoutinesModule } from './routines/routines.module';
import { JwtModule } from '@nestjs/jwt';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ExerciseModule } from './exercise/exercise.module';
import { RoomsModule } from './rooms/rooms.module';
import { AttendanceModule } from './attendance/attendance.module';


@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UsersModule,
    ExerciseModule,
    RoutinesModule,
    MembersModule,
    AppointmentsModule,
    PaymentModule,
    FileUploadModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule,
    RoomsModule,
    AttendanceModule,

  ],
  controllers: [],
  providers: [EmailService],
})
export class AppModule {}
