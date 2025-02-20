import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";


@Injectable()
export class AuthService {

    constructor( private readonly prisma: PrismaService ) {}

    async signup( user: any, confirmPassword: string ) {
        // const existingUser = await this.prisma.user.findUserByEmail(user.email);
        // if (existingUser) {
        //     throw new BadRequestException('El email ya está registrado');
        // }
        
     }


    async login( loginUser: any ) { }
}