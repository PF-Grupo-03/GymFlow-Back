import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Conectar a la base de datos al iniciar el módulo
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Desconectar al destruir el módulo
  }
}
