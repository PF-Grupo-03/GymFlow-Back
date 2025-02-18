import { Module } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';

@Module({
  controllers: [RoutinesController],
  providers: [RoutinesService],
})
export class RoutinesModule {}
