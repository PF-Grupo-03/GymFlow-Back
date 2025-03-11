import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ExerciseService } from "./exercise.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import { Musclues } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import * as streamifier from 'streamifier';
import { CloudinaryConfig } from "src/config/cloudinary.config";


@Controller('exercise')
export class ExerciseController {
    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly cloudinary: CloudinaryConfig
    ) {}


    @UseInterceptors(FileInterceptor('gifUrl'))
    @Post()
    async createExercise(@Body() body: CreateExerciseDto, @UploadedFile() file: Express.Multer.File) {
        console.log('Archivo recibido:', file);
        if (file) {
            const streamUpload = (fileBuffer: Buffer): Promise<any> => {
              return new Promise((resolve, reject) => {
                const uploadStream = this.cloudinary.getInstance().uploader.upload_stream((error, result) => {
                  if (result) {
                    resolve(result);
                  } else {
                    reject(error);
                  }
                });
                streamifier.createReadStream(fileBuffer).pipe(uploadStream);
              });
            };
          
            const uploadResult = await streamUpload(file.buffer);
            body.gifUrl = uploadResult.secure_url;
          }
        return await this.exerciseService.createExercise(body);
    }

    @Get()
    async getAllExercises() {
      return await this.exerciseService.getAllExercises();
    }

    @Get(':id')
    async getExerciseById(@Param('id') id: string) {
      return await this.exerciseService.getExerciseById(id);
    }
    
    @Get('muscle/:muscle')
    async getExercisesByMuscle(
        @Param('muscle', new ParseEnumPipe(Musclues)) muscle: Musclues
    ) {
        return await this.exerciseService.getExercisesByMuscle(muscle);
    }

    @Put(':id')
    async updateExercise(@Param('id') id: string, @Body() body: UpdateExerciseDto) {
      return await this.exerciseService.updateExercise(id, body);
    }

    @Delete(':id')
    async deleteExercise(@Param('id') id: string) {
      return await this.exerciseService.deleteExercise(id);
    }

    @Post('seed-exercise')
    async seedExercises() {
      return await this.exerciseService.seedExercises();
    }
}