import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Invoice } from 'src/entities/invoice.entity';
import { Customer } from 'src/entities/customer.entity';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Invoice])],
  providers: [CustomerService, InvoiceService],
  exports: [CustomerService, InvoiceService],
  controllers: [CustomerController],
})
export class CustomerModule {}
