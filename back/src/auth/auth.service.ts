import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { UserRole } from 'src/enum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(
    user: Omit<
      Users,
      'id' | 'createdAt' | 'updatedAt' | 'approved' | 'googleAccessToken'
    >,
  ) {
    user.email = user.email.toLowerCase();
    const existingUserDni = await this.prisma.users.findUnique({
      where: { dni: user.dni },
    });
    if (existingUserDni) {
      throw new BadRequestException('El DNI ya está registrado');
    }

    const existingUserPhone = await this.prisma.users.findUnique({
      where: { phone: user.phone },
    });
    if (existingUserPhone) {
      throw new BadRequestException('El teléfono ya está registrado');
    }

    const existingUser = await this.userService.findUserByEmail(user.email);

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hasheamos la contraseña y creamos el nuevo usuario.
    const hashPassword = await bcrypt.hash(user.password, 10);

    // Asignamos el rol y el estado de aprobación.
    const role =
      user.role === 'USER_TRAINING' ? 'USER_TRAINING' : 'USER_MEMBER';
    const approved = role === 'USER_MEMBER';

    const saveUser = await this.prisma.users.create({
      data: {
        ...user,
        dni: user.dni,
        password: hashPassword,
        role,
        approved,
      },
      select: {
        id: true,
        nameAndLastName: true,
        dni: true,
        email: true,
        phone: true,
        role: true,
        approved: true,
      },
    });

    if (!saveUser.approved) {
      return {
        messege:
          'Tu solicitud fue enviada. Un administrador debe aprobar tu cuenta.',
        user: saveUser,
      };
    }

    // Generamos el token de autenticación.
    const payload = {
      id: saveUser.id,
      email: saveUser.email,
      role: saveUser.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      user: saveUser,
      token,
    };
  }

  async signin(email: string, passwordLoggin: string) {
    const user = await this.prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.approved) {
      throw new ForbiddenException(
        'Tu cuenta aún no fue aprobada por un administrador',
      );
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

    const { password, ...withoutPasswordAndRole } = user;

    return {
      withoutPasswordAndRole,
      token,
    };
  }
  async validateOrCreateGoogleUser(profile: any) {
    const email = profile.emails[0].value.toLowerCase();
    let user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email,
          nameAndLastName: profile.displayName,
          role: UserRole.USER_MEMBER,
          dni: '',
          password: '',
          bDate: new Date(),
          address: '',
          phone: '',
        },
      });
    } else {
      user = await this.prisma.users.update({
        where: { email: email },
        data: { nameAndLastName: profile.displayName },
      });
    }

    const token = await this.generateToken(user);
    return { user, token };
  }

  async generateToken(user: Users): Promise<string> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }
}
