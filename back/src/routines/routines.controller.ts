import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AddExercisesDto } from './dto/add-exercise.dto';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  async createRoutine(@Body() body: CreateRoutineDto) {
    return this.routinesService.createRoutine(body);
  }

  @Get('name/:name')
  async getExercisesByName(@Param('name') name: string) { 
    return this.routinesService.getExercisesByName(name);
  }


  @Get()
  async getAllRoutines() {
    return this.routinesService.getAllRoutines();
  }

  @Get(':id')
  async getRoutineById(@Param('id') id: string) {
    return this.routinesService.getRoutineById(id);
  }

  // Ruta para agregar ejercicios a una rutina(agregar ejercicios a una rutina sin eliminar los anteriores)-----------------
  @Patch(':routineId/add-exercises')
async addExercisesToRoutine(
  @Param('routineId', new ParseUUIDPipe()) routineId: string,
  @Body() addExercisesDto: AddExercisesDto
) {
  return this.routinesService.addExercisesToRoutine(routineId, addExercisesDto);
}

  // Ruta para actualizar una rutina(eliminar ejercicios y agregar nuevos)-----------------------------------
  @Put(':id')
  async updateRoutine(@Param('id') id: string, @Body() body: UpdateRoutineDto) {
    return this.routinesService.updateRoutine(id, body);
  }


  @Delete(':id')
  async deleteRoutine(@Param('id') id: string) {
    return this.routinesService.deleteRoutine(id);
  }
}
