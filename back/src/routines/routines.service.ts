import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DayOfWeek } from 'src/enum/day.enum';
import { Musclues } from 'src/enum/musclues.enum';
import { PrismaService } from 'src/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

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
        const newRoutine = await this.prisma.routine.create({
            data: {
                day,
                userId,
                exercises: {
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
        return await this.prisma.routine.findMany({
            include: { routines: { include: { exercise: true } } },
        });
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
    

    async deleteRoutine(id: string) {
        await this.prisma.routineExercise.deleteMany({
            where: { routineId: id },
        });

        const deletedRoutine = await this.prisma.routine.delete({
            where: { id },
        });
        if (deletedRoutine) {
            throw new BadRequestException(`La rutina con el ID: ${id} no se pudo eliminar.`);
        }
        return { message: `Rutina con el ID: ${id} eliminada con éxito.` };
    }
}
