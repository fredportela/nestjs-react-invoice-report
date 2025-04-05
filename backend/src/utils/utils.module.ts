import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Module({
  providers: [UtilsService],
  exports: [UtilsService], // Exporta o serviço para ser usado em outros módulos
})
export class UtilsModule {}
