import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AddExercisesDto } from './dto/add-exercise.dto';
import { TrainerGuard } from 'src/guards/trainer.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { UserRole } from 'src/enum/roles.enum';
import { RolesGuard } from 'src/guards/roles.guards';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard, TrainerGuard)
  async createRoutine(@Body() body: CreateRoutineDto) {
    return this.routinesService.createRoutine(body);
  }

  @ApiBearerAuth()
  @Get('name/:name')
  @UseGuards(AuthGuard, TrainerGuard)
  async getExercisesByName(@Param('name') name: string) { 
    return this.routinesService.getExercisesByName(name);
  }


  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard, TrainerGuard)
  async getAllRoutines() {
    return this.routinesService.getAllRoutines();
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_BASIC, UserRole.USER_PREMIUM, UserRole.USER_DIAMOND, UserRole.USER_ADMIN, UserRole.USER_TRAINING) 
  async getRoutineById(@Param('id') id: string) {
    return this.routinesService.getRoutineById(id);
  }

  // Ruta para agregar ejercicios a una rutina(agregar ejercicios a una rutina sin eliminar los anteriores)-----------------
  @ApiBearerAuth()
  @Patch(':routineId/add-exercises')
  @UseGuards(AuthGuard, TrainerGuard)
  async addExercisesToRoutine(
    @Param('routineId', new ParseUUIDPipe()) routineId: string,
    @Body() addExercisesDto: AddExercisesDto
    ){
    return this.routinesService.addExercisesToRoutine(routineId, addExercisesDto);
  }

  // Ruta para actualizar una rutina(eliminar ejercicios y agregar nuevos)-----------------------------------
  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard, TrainerGuard)
  async updateRoutine(@Param('id') id: string, @Body() body: UpdateRoutineDto) {
    return this.routinesService.updateRoutine(id, body);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard, TrainerGuard)
  async softDeleteRoutine(@Param('id') id: string) {
    return this.routinesService.softDeleteRoutine(id);
  }
}
