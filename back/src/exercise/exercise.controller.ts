import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Post, Put } from "@nestjs/common";
import { ExerciseService } from "./exercise.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import { Musclues } from "@prisma/client";

@Controller('exercise')
export class ExerciseController {
    constructor(private readonly exerciseService: ExerciseService) {}


    @Post()
    async createExercise(@Body() body: CreateExerciseDto) {
    return this.exerciseService.createExercise(body);
    }

    @Get()
    async getAllExercises() {
    return this.exerciseService.getAllExercises();
    }

    @Get(':id')
    async getExerciseById(@Param('id') id: string) {
    return this.exerciseService.getExerciseById(id);
    }
    
    @Get('muscle/:muscle')
    async getExercisesByMuscle(
        @Param('muscle', new ParseEnumPipe(Musclues)) muscle: Musclues
    ) {
        return this.exerciseService.getExercisesByMuscle(muscle);
    }

    @Put(':id')
    async updateExercise(@Param('id') id: string, @Body() body: UpdateExerciseDto) {
    return this.exerciseService.updateExercise(id, body);
    }

    @Delete(':id')
    async deleteExercise(@Param('id') id: string) {
    return this.exerciseService.deleteExercise(id);
    }

    @Post('sync')
    async syncExercises() {
        return this.exerciseService.syncExercisesFromApi();
    }
}