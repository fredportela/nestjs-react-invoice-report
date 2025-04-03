import { Module } from '@nestjs/common';
import { PdfExtractorService } from './pdf-extractor.service';
import { CustomerModule } from '../customer/customer.module';
import { DataTranformService } from './data-transform.service';
import { InvoiceService } from 'src/customer/invoice.service';

@Module({
  imports: [CustomerModule], 
  providers: [PdfExtractorService, DataTranformService],
  exports: [PdfExtractorService],
})
export class PdfExtractorModule {}
