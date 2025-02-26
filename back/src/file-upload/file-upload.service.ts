import { Injectable } from "@nestjs/common";
import { CloudinaryConfig } from "src/config/cloudinary.config";
import { PrismaService } from "src/prisma.service";


@Injectable()
export class FileUploadService {
    constructor(private readonly cloudinaryConfig: CloudinaryConfig,
        private readonly prisma: PrismaService
    ) {}

    async uploadFile(file: Express.Multer.File, exerciseId: string) {
        const cloudinary = this.cloudinaryConfig.getInstance();
    
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            async (error, result) => {
              if (error) return reject(error);
    
              // 🔹 Guardamos la URL del GIF en el ejercicio correspondiente.
              await this.prisma.exercise.update({
                where: { id: exerciseId },
                data: { gifUrl: result.secure_url },
              });
    
              resolve(result);
            }
          ).end(file.buffer);
        });
      }
}