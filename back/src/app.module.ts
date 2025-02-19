import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MembersModule } from './members/members.module';
import { AppointmentsModule } from "./appointments/appointments.module";

@Module({
  imports: [UsersModule, MembersModule, AppointmentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
