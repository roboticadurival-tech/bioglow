import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { telemetria } from './dto/telemetria.dto.js';
import { PrismaService } from './prisma.service.js';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  // Injeta o PrismaService para acessar o PostgreSQL
  constructor(private readonly prisma: PrismaService) {}

  @EventPattern('apiario/+/colmeia/+/telemetria')
  async receberTelemetria(@Payload() data: unknown, @Ctx() context: any) {
    const mqttContext = context as MqttContext;
    const topico = mqttContext.getTopic();

    const ids = this.extrairIds(topico);
    if (!ids) {
      this.logger.warn(`Tópico fora do padrão, mensagem descartada: ${topico}`);
      return;
    }

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      this.logger.warn(`Payload não é um objeto JSON (${topico}): ${String(data)}`);
      return;
    }

    const dto = plainToInstance(telemetria, data);
    const erros = await validate(dto, { whitelist: true });

    if (erros.length > 0) {
      const motivos = erros.flatMap((e: any) => Object.values(e.constraints ?? {}));
      this.logger.warn(`Leitura inválida (${topico}): ${motivos.join('; ')}`);
      return;
    }

    // --- PARTE 8: Salvando diretamente no PostgreSQL ---
    const registro = await this.prisma.telemetria.create({
      data: {
        apiarioId: ids.apiarioId,
        colmeiaId: ids.colmeiaId,
        pesoKg: dto.peso_kg,
        tempInterna: dto.temp_interna,
        umidadeInterna: dto.umidade_interna,
        bateriaV: dto.bateria_v,
      },
    });

    this.logger.log(
      `💾 [Banco OK] ID ${registro.id} salvo | Apiário: ${registro.apiarioId}, Colmeia: ${registro.colmeiaId} ` +
        `(${registro.pesoKg} kg, ${registro.tempInterna} °C, ${registro.umidadeInterna} %, ${registro.bateriaV} V)`,
    );
  }

  private extrairIds(topico: string) {
    const m = /^apiario\/([^/]+)\/colmeia\/([^/]+)\/telemetria$/.exec(topico);
    return m ? { apiarioId: m[1], colmeiaId: m[2] } : null;
  }
}
