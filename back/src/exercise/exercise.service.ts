import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Musclues } from "src/enum/musclues.enum";
import { PrismaService } from "src/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class ExerciseService {

    constructor(private readonly prisma: PrismaService) {}

    async createExercise(data: CreateExerciseDto){
        
        if (!data.name || !data.musclue) {
            throw new BadRequestException('Todos los campos obligatorios deben estar completos.');
        }
        
        try {
            const newExercise = await this.prisma.exercise.create({
                data: {
                    name: data.name,
                    musclue: data.musclue,
                    gifUrl: data.gifUrl
                }
            });
            return {messagge: 'Ejercicio creado con éxito.', newExercise};
        } catch (error) {
            throw new BadRequestException(error.message || 'Error al crear el ejercicio.');
        }
        
    }

    async getAllExercises(){
        const exercises = await this.prisma.exercise.findMany();
        if (!exercises.length) {
            throw new NotFoundException('No se encontraron ejercicios registrados.');
        }        
        return exercises;
    }

    async getExerciseById(id: string){
        const exercise = await this.prisma.exercise.findUnique({
            where: {id},
        });

        if (!exercise) {
            throw new NotFoundException(`No se encontró el ejercicio con el ID: ${id}`)
        };
        return exercise;
    }

    async getExercisesByMuscle(muscle: Musclues) {
        const exercises = await this.prisma.exercise.findMany({
            where: { musclue: muscle },
        });

        if (!exercises.length) {
            throw new NotFoundException(`No hay ejercicios registrados para el músculo ${muscle}`);
        }

        return exercises;
    }

    async updateExercise(id: string, dto: UpdateExerciseDto){

        const exercise = await this.prisma.exercise.findUnique({where: { id } });

        if (!exercise) {
            throw new NotFoundException(`No se encontró el ejercicio con el ID: ${id}`);
        }

        const updatedExercise = await this.prisma.exercise.update({
            where: { id },
            data: { ...dto }
        });

        return { message: "Ejercicio actualizado con éxito", updatedExercise };
    }

    async deleteExercise(id: string) {
        const exercise = await this.prisma.exercise.findUnique({
            where: { id }
        });

        if (!exercise) {
            throw new NotFoundException(`No se encontró el ejercicio con ID: ${id}, eliminación fallida.`);
        }

        await this.prisma.exercise.delete({ where: { id } });

        return { message: `Ejercicio con ID: ${id} eliminado con éxito.` };
    }

}