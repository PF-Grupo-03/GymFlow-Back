import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DayOfWeek } from 'src/enum/day.enum';
import { Musclues } from 'src/enum/musclues.enum';
import { PrismaService } from 'src/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AddExercisesDto } from './dto/add-exercise.dto';

@Injectable()
export class RoutinesService {
    constructor (private prisma: PrismaService) {}

    async createRoutine(dto: CreateRoutineDto) {
        const {day, userId, exercises} = dto;

        if (!exercises.length) {
            throw new BadRequestException("Debe incluir al menos un ejercicio en la rutina.");
        }
        const userExists = await this.prisma.users.findUnique({ where: { id: userId } });
        if (!userExists) {
            throw new NotFoundException("El usuario no existe.");
        }
        const exerciseIds = exercises.map(e => e.exerciseId);
        const existingExercises = await this.prisma.exercise.findMany({
            where: { id: { in: exerciseIds } },
        });
        if (existingExercises.length !== exerciseIds.length) {
            throw new BadRequestException("Uno o más ejercicios no existen.");
        }
         
        const existingRoutine = await this.prisma.routine.findFirst({
            where: {
                day,
                userId,
                isDeleted: false,
                routines: {
                    every: {
                        exerciseId: { in: exerciseIds }
                    }
                }
            }
        });

        if (existingRoutine) {
            throw new ConflictException("Ya existe una rutina con los mismos ejercicios para este día.");
        }

        const newRoutine = await this.prisma.routine.create({
            data: {
                day,
                userId,
                routines: {
                    create: exercises.map(e => ({
                        exercise: { connect: { id: e.exerciseId } },
                        series: e.series,
                        repetitions: e.repetitions
                    }))
                }
            },
            include: { routines: { include: { exercise: true } } },
        });
        return { message: "Rutina creada con éxito.", newRoutine };
    }

    async getAllRoutines() {
        const routines = await this.prisma.routine.findMany({
            where: {
                isDeleted: false,
            },
            include: {
                routines: {
                    where: { isDeleted: false },
                    include: { exercise: true }
                },
            },
        });
        if (!routines.length){
            throw new NotFoundException("No se encontraron rutinas.");
        }
        return routines;
    }

    async getRoutineById(id: string) {
        const routine = await this.prisma.routine.findUnique({
            where: { id },
            include: { routines: { include: { exercise: true } } },
        });
        if (!routine) {
            throw new NotFoundException(`No se encontró la rutina con el ID: ${id}`);
        }
        return routine;
    }
    
    
    async getExercisesByName(nameE: string) {
        const nameOfExercises = await this.prisma.exercise.findMany({
            where: { name: nameE },
        });
        if (!nameOfExercises.length) {
            throw new NotFoundException(`No se encontró el ejercicio con el nombre: ${nameE}`);
        }
        return nameOfExercises;
    }


    async addExercisesToRoutine(routineId: string, addExercisesDto: AddExercisesDto) {
        const routine = await this.prisma.routine.findUnique({
          where: { id: routineId },
        });
        if (!routine) {
          throw new NotFoundException(`No se encontró la rutina con ID: ${routineId}`);
        }

        const existingRoutineExercises = await this.prisma.routineExercise.findMany({
            where: { routineId },
            select: { exerciseId: true },
        });
        const existingExerciseIds = new Set(existingRoutineExercises.map(e => e.exerciseId));
        
        for (const exercise of addExercisesDto.exercises) {
            if (existingExerciseIds.has(exercise.exerciseId)) {
              throw new BadRequestException(
                `El ejercicio con ID: ${exercise.exerciseId} ya existe en la rutina con ID: ${routineId}`
              );
            }
        }
      
        const newExercises = addExercisesDto.exercises.map((exercise) => ({
          routineId,
          exerciseId: exercise.exerciseId,
          series: exercise.series,
          repetitions: exercise.repetitions,
        }));
      
        await this.prisma.routineExercise.createMany({
          data: newExercises,
        });
        return { message: 'Ejercicios agregados con éxito.', newExercises };
      }
      


    async updateRoutine(id: string, dto: UpdateRoutineDto) {
        // eliminamos los ejercicios de la rutina
        await this.prisma.routineExercise.deleteMany({ where: { routineId: id } });

        // actualizamos la rutina con los nuevos ejercicios
        const updatedRoutine = await this.prisma.routine.update({
            where: { id },
            data: {
                routines: {
                    create: dto.exercises.map(e => ({
                        exercise: { connect: { id: e.exerciseId } },
                        series: e.series,
                        repetitions: e.repetitions
                    }))
                }
            },
            include: { routines: { include: { exercise: true } } },
        });
        
        return { message: 'Rutina actualizada con éxito.', updatedRoutine };
    }
    

    async softDeleteRoutine(id: string) {
        
        await this.prisma.routineExercise.updateMany({
            where: { routineId: id },
            data: { isDeleted: true },
        });
    
        const deletedRoutine = await this.prisma.routine.update({
            where: { id },
            data: { isDeleted: true },
        });
    
        if (!deletedRoutine.isDeleted) {
            throw new BadRequestException(`La rutina con el ID: ${id} no se pudo eliminar.`);
        }
    
        return { message: `Rutina con el ID: ${id} eliminada con éxito.` };
    }
    
}
