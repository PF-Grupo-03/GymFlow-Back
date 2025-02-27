import { Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('files')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}

    @Post(':exerciseId')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File,
      @Param('exerciseId') exerciseId: string
    ) {
      return this.fileUploadService.uploadFile(file, exerciseId);
    }
}