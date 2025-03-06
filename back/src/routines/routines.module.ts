import { Module } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { ExerciseModule } from 'src/exercise/exercise.module';

@Module({
  imports: [ ExerciseModule],
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports: [RoutinesService]
})
export class RoutinesModule {}
