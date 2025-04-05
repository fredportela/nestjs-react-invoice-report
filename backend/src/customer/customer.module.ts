import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Invoice } from '../entities/invoice.entity';
import { Customer } from '../entities/customer.entity';
import { InvoiceService } from './invoice.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Invoice]), UtilsModule],
  providers: [CustomerService, InvoiceService],
  exports: [CustomerService, InvoiceService],
  controllers: [CustomerController],
})
export class CustomerModule {}
