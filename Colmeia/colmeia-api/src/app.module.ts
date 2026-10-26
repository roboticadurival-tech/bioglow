import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { PrismaService } from './prisma.service.js';
import { TelemetriaController } from './telemetria/telemetria.controller.js';
import { TelemetriaService } from './telemetria/telemetria.service.js';

@Module({
  imports: [],
  controllers: [AppController, TelemetriaController],
  providers: [PrismaService, TelemetriaService],
})
export class AppModule {}