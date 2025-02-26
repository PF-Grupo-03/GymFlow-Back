import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoutinesService {
    constructor (private prisma: PrismaService) {}

    async createRoutine(data: {day: string, categories: string[], exercises: string[]}){
        return this.prisma.routine.create({
            data: {
                day: data.day,
                categories: data.categories, 
                exercises: {
                    create: data.exercises.map(exerciseId => ({
                        exercise: {connect: {id: exerciseId}}
                    }))
                }
            },
            include: { exercises: {include: {exercise: true} } },
        });
    }

    async getAllRoutines(){
        return this.prisma.routine.findMany({
            include: { exercises: {include: {exercise: true} } },
        });
    }

    async getRoutineById(id: string){
        return this.prisma.routine.findUnique({
            where: {id},
            include: { exercises: {include: {exercise: true} } },
        });
    }

    async updateRoutine(id: string, data: {day?: string, categories?: string[], exercises?: string[]},){
        return this.prisma.$transaction([
            this.prisma.routineExercise.deleteMany({where: {routineId: id}}),
            this.prisma.routine.update({
                where: {id},
                data: {
                    day: data.day,
                    categories: data.categories,
                    exercises: {
                        create: data.exercises?.map((exerciseId) => ({
                            exercise: {connect: {id: exerciseId}},
                        })),
                    },
                },
                include: { exercises: {include: {exercise: true} } },
            }),
        ]);
    }

    async deleteRoutine(id: string){
        return this.prisma.routine.delete({
            where: {id},
        });
    }
}
