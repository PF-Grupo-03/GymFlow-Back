import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  async createRoutine(@Body() body: CreateRoutineDto) {
    return this.routinesService.createRoutine(body);
  }

  @Get()
  async getAllRoutines() {
    return this.routinesService.getAllRoutines();
  }

  @Get(':id')
  async getRoutineById(@Param('id') id: string) {
    return this.routinesService.getRoutineById(id);
  }

  @Put(':id')
  async updateRoutine(@Param('id') id: string, @Body() body: UpdateRoutineDto) {
    return this.routinesService.updateRoutine(id, body);
  }

  @Delete(':id')
  async deleteRoutine(@Param('id') id: string) {
    return this.routinesService.deleteRoutine(id);
  }
}
