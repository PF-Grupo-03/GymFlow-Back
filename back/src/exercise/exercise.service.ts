import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import axios from "axios";
import { Musclues } from "@prisma/client";

@Injectable()
export class ExerciseService {

    constructor(private readonly prisma: PrismaService) {}

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

    // Función para podr traducir los datos recibidos desde la API ExerciseDB con la API LibreTranslate-----------------------------------------
    async translateTextLibre(text: string): Promise<string> {
        try {
            const response = await axios.post("https://libretranslate.com/translate", {
                q: text,
                source: "en",
                target: "es",
                format: "text"
            });
            console.log("Texto original:", text, " - Traducido:", response.data.translatedText);
            return response.data.translatedText;
        }catch (error) {
            console.error("Error al traducir con LibreTranslate:", error);
            // En caso de error, devolvemos el texto original.
            return text;
        }
    }


    // Funcion para integrar la traducción a la funcion de sincronización de ejercicios.----------------------------------------------------
    async translateExerciseData(exercise: any): Promise<any> {
        // Traduce otros campos usando LibreTranslate
        const translatedName = await this.translateTextLibre(exercise.name);
        const translatedEquipment = await this.translateTextLibre(exercise.equipment);
        const translatedTarget = await this.translateTextLibre(exercise.target);
      
        // Diccionario que mapea el bodyPart en "inglés" al valor del enum en "español".
        const muscluesMap: Record<string, Musclues> = {
          "chest": Musclues.PECHO,
          "back": Musclues.ESPALDA,
          "biceps": Musclues.BICEPS,
          "triceps": Musclues.TRICEPS,
          "shoulders": Musclues.HOMBROS,
          "core": Musclues.CORE,
          "cardio": Musclues.CARDIO,
          "upper arms": Musclues.BRAZOS_SUPERIORES,
          "lower arms": Musclues.BRAZOS_INFERIORES,
          "upper legs": Musclues.PIERNAS_SUPERIORES,
          "lower legs": Musclues.PIERNAS_INFERIORES,
          "neck": Musclues.CUELLO,
          "waist": Musclues.CINTURA,
        };
      
        // Verificamos y mapeamos el bodyPart recibido.
        let mappedMuscle: Musclues;
        if (!exercise.bodyPart) {
          throw new BadRequestException(`El ejercicio ${exercise.name} no tiene definido el campo 'bodyPart'.`);
        } else {
          const muscleKey = exercise.bodyPart.toLowerCase();
          if (muscluesMap[muscleKey]) {
            mappedMuscle = muscluesMap[muscleKey];
          } else {
            throw new BadRequestException(`Valor no reconocido para bodyPart: ${exercise.bodyPart} en el ejercicio ${exercise.name}.`);
          }
        }
      
        // Traducimos los arreglos (si es que existen)
        const translatedSecondaryMuscles = exercise.secondaryMuscles && Array.isArray(exercise.secondaryMuscles)
          ? await Promise.all(exercise.secondaryMuscles.map((muscle: string) => this.translateTextLibre(muscle)))
          : [];
      
        const translatedInstructions = exercise.instructions && Array.isArray(exercise.instructions)
          ? await Promise.all(exercise.instructions.map((instruction: string) => this.translateTextLibre(instruction)))
          : [];
      
        return {
          name: translatedName,
          musclue: mappedMuscle, 
          gifUrl: exercise.gifUrl,
        //   equipment: translatedEquipment,
        //   target: translatedTarget,
        //   secondaryMuscles: translatedSecondaryMuscles,
          instructions: translatedInstructions,
        };
      }
      
      
    // Función para sincronizar los datos de un ejercicio con la base de datos.----------------------------------------------------
    async syncExercisesFromApi(): Promise<any> {
        try {
            const apiUrl = "https://exercisedb.p.rapidapi.com/exercises";
            const response = await axios.get(apiUrl, {
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
                },
                params: {
                    limit: 300  // Traemos 150 ejercicios de la API
                  }
            });
      
            const exercisesFromApi = response.data;
            if (!Array.isArray(exercisesFromApi)) {
                throw new BadRequestException("Respuesta inesperada de la API externa.");
            }
      
            const savedExercises = [];
            for (const exercise of exercisesFromApi) {
                // Iteramos por todos los campos del ejercicio y los traducimos usando LibreTranslate
                const translatedData = await this.translateExerciseData(exercise);
                
                const savedExercise = await this.prisma.exercise.upsert({
                    where: { name: translatedData.name },
                    update: translatedData,
                    create: translatedData,
                });
                savedExercises.push(savedExercise);
            }
      
            return {
                message: "Ejercicios sincronizados y traducidos desde la API externa correctamente.",
                count: savedExercises.length,
            };
        } catch (error) {
            throw new BadRequestException(
                error.message || "Error al sincronizar ejercicios desde la API externa."
            );
        }
    }
      

}