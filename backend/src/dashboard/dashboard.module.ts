import { Module } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { InvoiceService } from 'src/customer/invoice.service';
import { DashboardController } from './dashboard.controller';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [CustomerModule],
  providers: [],
  exports: [],
  controllers: [DashboardController],
})
export class DashboardModule {}
