import { Controller, Get, Param } from '@nestjs/common';
import { TelemetriaService } from './telemetria.service.js';

@Controller('telemetria')
export class TelemetriaController {
  constructor(private readonly telemetriaService: TelemetriaService) {}

  @Get()
  async ultimas() {
    return this.telemetriaService.ultimasLeituras();
  }

  @Get('apiario/:apiarioId/colmeia/:colmeiaId')
  async historico(
    @Param('apiarioId') apiarioId: string,
    @Param('colmeiaId') colmeiaId: string,
  ) {
    return this.telemetriaService.historicoDaColmeia(apiarioId, colmeiaId);
  }
}