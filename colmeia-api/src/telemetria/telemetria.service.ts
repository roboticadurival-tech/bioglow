import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class TelemetriaService {
  constructor(private readonly prisma: PrismaService) {}

  async ultimasLeituras(limite = 50) {
    return this.prisma.telemetria.findMany({
      orderBy: { criadoEm: 'desc' },
      take: limite,
    });
  }

  async historicoDaColmeia(apiarioId: string, colmeiaId: string) {
    return this.prisma.telemetria.findMany({
      where: { apiarioId, colmeiaId },
      orderBy: { criadoEm: 'desc' },
    });
  }
}