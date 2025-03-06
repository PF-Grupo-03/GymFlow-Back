import { Module } from "@nestjs/common";
import { ExerciseController } from "./exercise.controller";
import { ExerciseService } from "./exercise.service";
import { PrismaService } from "src/prisma.service";

@Module({
    imports: [],
    controllers: [ ExerciseController ],
    providers: [ ExerciseService, PrismaService ],
    exports: [ ExerciseService ]
})
export class ExerciseModule {}