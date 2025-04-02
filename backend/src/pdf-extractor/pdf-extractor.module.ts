import { Module } from '@nestjs/common';
import { PdfExtractorService } from './pdf-extractor.service';
import { CustomerModule } from 'src/customer/customer.module';
import { DataTranformService } from './data-transform.service';

@Module({
  imports: [CustomerModule], 
  providers: [PdfExtractorService, DataTranformService],
  exports: [PdfExtractorService],
})
export class PdfExtractorModule {}
