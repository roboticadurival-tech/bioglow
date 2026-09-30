import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString =
      process.env.DATABASE_URL ??
      'postgresql://colmeia_user:colmeia_password@localhost:5432/colmeia_db?schema=public';

    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // Passamos o adaptador obrigatoriamente para a classe pai no Prisma 7
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}