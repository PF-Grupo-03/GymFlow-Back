import { Module } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [CloudinaryConfig],  
    exports: [CloudinaryConfig], 
})
export class CloudinaryModule {}
