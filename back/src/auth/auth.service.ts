import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/users.dto';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup( user: Omit<Users, 'id' | 'createdAt' | 'updatedAt'>) {
      
    const existingUserPhone = await this.prisma.users.findUnique({ where: { phone: user.phone } });
    if (existingUserPhone) {
      throw new BadRequestException('El teléfono ya está registrado');
    }

    const existingUser = await this.userService.findUserByEmail(user.email);
    
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hasheamos la contraseña y creamos el nuevo usuario.
    const hashPassword = await bcrypt.hash(user.password, 10);
    
    const role = user.role === 'USER_TRAINING' ? 'USER_TRAINING' : 'USER_MEMBER';
    
    const saveUser = await this.prisma.users.create({ 
      data: {
        ...user,
        password: hashPassword,
        role,
        approved: role === 'USER_MEMBER',
      }
    });

    const { password, ...userWithoutPassword } = saveUser;

    if (!saveUser.approved) {
      return {
        messege: "Tu solicitud fue enviada. Un administrador de aprobar tu cuenta.",
        user: userWithoutPassword
      }
    }

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
        
        
  async signin( email: string, passwordLoggin: string ) {
    
    const user = await this.prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
    }


    if (!user.approved) {
      throw new ForbiddenException('Tu cuenta aún no fue aprobada por un administrador');
    }

    const passwordMatch = await bcrypt.compare(passwordLoggin, user.password);
    if (!passwordMatch) {
    throw new UnauthorizedException('Credenciales inválidas');
    }
      
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  
    const token = this.jwtService.sign(payload);

    const {password, role, ...withoutPasswordAndRole} = user;
    
    return {
      withoutPasswordAndRole,
      token
    };
      
  }
}