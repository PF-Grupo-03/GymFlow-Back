import { Module } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';

@Module({
  controllers: [RoutineController],
  providers: [RoutineService],
})
export class RoutineModule {}
