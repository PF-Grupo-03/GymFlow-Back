import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { UserRole } from 'src/roles.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Aseguramos que el email esté en minúsculas
    const email = profile.emails[0].value.toLowerCase();

    // Validamos que el perfil contenga la información necesaria
    if (!profile.name || !profile.emails || !email) {
      return done(new Error('Faltan datos en el perfil de Google'), null);
    }

    let user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email: email,
          nameAndLastName: `${profile.name.givenName} ${profile.name.familyName}`,
          role: UserRole.USER_MEMBER,
          dni: '', // Valor por defecto
          password: '', // No se usa, pero es obligatorio
          bDate: new Date(), // O una fecha predeterminada
          address: '', // Valor por defecto
          phone: '', // Valor por defecto
        },
      });
    }

    done(null, user);
  }
}
