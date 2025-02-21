import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/users.dto";


@Injectable()
export class AuthService {

    constructor(
      private readonly prisma: PrismaService,
      private readonly userService: UsersService,
      private jwtService: JwtService,
    ) {}

    async signup( user: Partial<CreateUserDto>, confirmPassword: string ) {
        
        if (user.password !== confirmPassword) {
          throw new BadRequestException('Las contraseñas no coinciden');
        }
                  
        const existingUser = await this.userService.findUserByEmail(user.email);
        
        if (existingUser) {
         throw new BadRequestException('El email ya está registrado');
        }

        // Hasheamos la contraseña y creamos el nuevo usuario.
        const hashPassword = await bcrypt.hash(user.password, 10);
        const newUser = {...user, password: hashPassword};
        
        const saveUser = await this.prisma.users.create({ data: newUser });
        
        const {password, ...userWithoutPassword} = saveUser;


        // Generamos el token de autenticación.
        const payload = {
          id: saveUser.id,
          email: saveUser.email,
          role: saveUser.role
        };
        const token = this.jwtService.sign(payload);

        return {
          user: userWithoutPassword, 
          token
        };
    }
        
        
    async signin( email: string, password: string ) {
    
    const user = await this.prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
    throw new UnauthorizedException('Credenciales inválidas');
    }
      
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  
    const token = this.jwtService.sign(payload);

    return {
    token,
    message: "Usuario loggeado con éxito.",
    };  
      
  }
}