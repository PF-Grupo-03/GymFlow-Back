import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import { Musclues } from "@prisma/client";
import { CloudinaryConfig } from "src/config/cloudinary.config";
import exercisesJson from './exercises.json';

@Injectable()
export class ExerciseService {
    private readonly exercises = exercisesJson
    
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryConfig,
    ) {}

    async createExercise(data: CreateExerciseDto){
        
        if (!data.name || !data.musclue) {
            throw new BadRequestException('Todos los campos obligatorios deben estar completos.');
        }
        const nameOfExercise = await this.prisma.exercise.findMany({
            where: { name: data.name },
        });
        if (nameOfExercise.length) {
            throw new BadRequestException(`El ejercicio con el nombre: ${data.name} ya existe.`);
        }
        let uploadedGifUrl: string | undefined;
        if (data.gifUrl) {
        const uploadResult = await this.cloudinary
            .getInstance()
            .uploader.upload(data.gifUrl);
        uploadedGifUrl = uploadResult.secure_url;
        }

        try {
            const newExercise = await this.prisma.exercise.create({
                data: {
                    name: data.name,
                    musclue: data.musclue,
                    gifUrl: uploadedGifUrl,
                    instructions: data.instructions ? data.instructions : []
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

    async seedExercises(): Promise<{ count: number; message: string }> {
        // Mapeamos cada strings y igualamos a valores del enum Musclues.
        const muscluesMap: Record<string, Musclues> = {
          "pecho": Musclues.PECHO,
          "espalda": Musclues.ESPALDA,
          "biceps": Musclues.BICEPS,
          "triceps": Musclues.TRICEPS,
          "hombros": Musclues.HOMBROS,
          "core": Musclues.CORE,
          "cardio": Musclues.CARDIO,
          "brazos inferiores": Musclues.BRAZOS_INFERIORES,
          "brazos superiores": Musclues.BRAZOS_SUPERIORES,
          "parte superior de las piernas": Musclues.PIERNAS_SUPERIORES,
          "piernas inferiores": Musclues.PIERNAS_INFERIORES,
          "piernas superiores": Musclues.PIERNAS_SUPERIORES,
          "cuello": Musclues.CUELLO,
          "cintura": Musclues.CINTURA
        };
     
        let seededCount = 0;
        
        for (const exercise of this.exercises) {
          // Usamos "nombre" o "name" como nombre del ejercicio
          const exerciseName = exercise.nombre || exercise.Nombre;
          if (!exerciseName) {
            console.warn("Ejercicio sin nombre, se omitirá:", exercise);
            continue;
          }
          
          // Verificar que exista el bodyPart
          const bodyPartRaw = exercise.bodyPart;
          if (!bodyPartRaw) {
            console.warn(`Ejercicio ${exerciseName} omitido: no se encontró bodyPart.`);
            continue;
          }
          
          const muscleKey = bodyPartRaw.toLowerCase();
          if (!muscleKey || !muscluesMap[muscleKey]) {
            console.warn(`Ejercicio ${exerciseName} omitido: bodyPart no reconocido: ${bodyPartRaw}`);
            continue;
          }
          
          try {
            await this.prisma.exercise.upsert({
              where: { name: exerciseName },
              update: {
                musclue: muscluesMap[muscleKey],
                gifUrl: exercise.gifUrl,
                instructions: exercise.instrucciones,
              },
              create: {
                name: exerciseName,
                musclue: muscluesMap[muscleKey],
                gifUrl: exercise.gifUrl,
                instructions: exercise.instrucciones,
              },
            });
            seededCount++;
          } catch (error: any) {
            console.error(`Error al seedear el ejercicio ${exerciseName}: ${error.message}`);
            // No lanzamos la excepción para continuar con los demás ejercicios.
          }
        }
        
        return {
          message: `Se han seedeado ${seededCount} ejercicios en la DB.`,
          count: seededCount,
        };
    }
    
}