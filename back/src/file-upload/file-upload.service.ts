import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FileUploadService {
  constructor(
    private cloudinaryConfig: CloudinaryConfig,
    private readonly prisma: PrismaService
  ) {}

  async uploadFile(file: Express.Multer.File, exerciseId: string) {
    const cloudinary = this.cloudinaryConfig.getInstance();

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            console.error('Error al subir a Cloudinary:', error);
            return reject(new InternalServerErrorException('Error al subir el archivo a Cloudinary.'));
          }
          if (!result || !result.secure_url) {
            return reject(new InternalServerErrorException('No se obtuvo la URL del archivo en Cloudinary.'));
          }
          try {
            
            await this.prisma.exercise.update({
              where: { id: exerciseId },
              data: { gifUrl: result.secure_url },
            });
            resolve(result);
          } catch (err) {
            console.error('Error al actualizar el ejercicio en la base de datos:', err);
            reject(new InternalServerErrorException('Error al actualizar el ejercicio en la base de datos.'));
          }
        }
      ).end(file.buffer);
    });
  }
}
