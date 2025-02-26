import { Module } from "@nestjs/common";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadService } from "./file-upload.service";
import { CloudinaryModule } from "src/config/cloudinary.module";
import { PrismaService } from "src/prisma.service";


@Module({
    imports: [CloudinaryModule],
    controllers: [FileUploadController],
    providers: [FileUploadService, PrismaService],
})
export class FileUploadModule {}