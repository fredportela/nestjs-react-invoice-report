import { Controller, Get, Param, NotFoundException, Res } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from 'src/entities/customer.entity';
import { InvoiceService } from './invoice.service';
import { Invoice } from 'src/entities/invoice.entity';
import { join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('api/customers')
export class CustomerController {
  
  private readonly pdfDirectory = join(__dirname, '..', '..', 'invoices');

  constructor(
    private readonly customerService: CustomerService,
    private readonly invoiceService: InvoiceService
  ) {}

  @Get()
  async findAllCustomers(): Promise<Customer[]> {
    return this.customerService.findAllCustomers();
  }

  @Get('/:clientNumber')
  async findCustomerById(@Param('clientNumber') clientNumber: string): Promise<Customer | null> {
    return this.customerService.findCustomerByClientNumber(clientNumber);
  }

  @Get('/invoices/:clientNumber')
  async findInvoicesByClinentNumber(@Param('clientNumber') clientNumber: string): Promise<Invoice[] | null> {
    return this.invoiceService.findInvoicesCustomerNumber(clientNumber);
  }
  
  @Get('/invoice/pdf/:fileName')
  async getPdf(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = join(this.pdfDirectory, fileName);

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Arquivo PDF não encontrado.');
    }

    // Envia o arquivo para o cliente
    res.sendFile(filePath);
  }

}
