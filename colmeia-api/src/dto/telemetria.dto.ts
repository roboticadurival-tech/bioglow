import { IsISO8601, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class telemetria {
  @IsNumber()
  @Min(0)
  @Max(200)
  peso_kg!: number;

  @IsNumber()
  @Min(-40)
  @Max(85)
  temp_interna!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  umidade_interna!: number;

  @IsNumber()
  @Min(0)
  @Max(6)
  bateria_v!: number;

  @IsOptional()
  @IsISO8601()
  timestamp?: string;
}