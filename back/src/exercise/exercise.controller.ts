import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ExerciseService } from "./exercise.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import { Musclues } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import * as streamifier from 'streamifier';
import { CloudinaryConfig } from "src/config/cloudinary.config";
import { ApiBearerAuth } from "@nestjs/swagger";
import { TrainerGuard } from "src/guards/trainer.guards";
import { AuthGuard } from "src/guards/auth.guards";
import { RolesGuard } from "src/guards/roles.guards";
import { Roles } from "src/decorators/roles.decorators";
import { UserRole } from "src/enum/roles.enum";


@Controller('exercise')
export class ExerciseController {
    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly cloudinary: CloudinaryConfig
    ) {}

    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('gifUrl'))
    @Post()
    @UseGuards(AuthGuard, TrainerGuard)
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

    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, TrainerGuard)
    async getAllExercises() {
      return await this.exerciseService.getAllExercises();
    }

    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER_BASIC, UserRole.USER_PREMIUM, UserRole.USER_DIAMOND, UserRole.USER_ADMIN, UserRole.USER_TRAINING)
    async getExerciseById(@Param('id') id: string) {
      return await this.exerciseService.getExerciseById(id);
    }
    
    @ApiBearerAuth()
    @Get('muscle/:muscle')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER_BASIC, UserRole.USER_PREMIUM, UserRole.USER_DIAMOND, UserRole.USER_ADMIN, UserRole.USER_TRAINING)
    async getExercisesByMuscle(
        @Param('muscle', new ParseEnumPipe(Musclues)) muscle: Musclues
    ) {
        return await this.exerciseService.getExercisesByMuscle(muscle);
    }

    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(AuthGuard, TrainerGuard)
    async updateExercise(@Param('id') id: string, @Body() body: UpdateExerciseDto) {
      return await this.exerciseService.updateExercise(id, body);
    }

    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard, TrainerGuard)
    async softDeleteExercise(@Param('id') id: string) {
      return await this.exerciseService.softDeleteExercise(id);
    }

    @ApiBearerAuth()
    @Post('seed-exercise')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER_ADMIN)
    async seedExercises() {
      return await this.exerciseService.seedExercises();
    }
}