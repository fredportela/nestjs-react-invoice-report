import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Invoice } from '../entities/invoice.entity';
import { SearchInvoiceDto } from './dto/SearchInvoice.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async createCustomer(name: string, clientNumber: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ clientNumber: clientNumber });
    if(customer) {
      return customer
    }
    const newCustomer = this.customerRepository.create({ name, clientNumber });
    return this.customerRepository.save(newCustomer);
  }

  async createInvoice(invoice: Invoice, customer: Customer): Promise<Invoice> {
    let newInvoice = new Invoice();
    newInvoice = {
      ...invoice,
      ...customer
    }
    newInvoice = this.invoiceRepository.create(newInvoice);
    return this.invoiceRepository.save(newInvoice);
  }

  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find({ relations: ['invoices'] });
  }

  async saveInvoice(invoice: Invoice, name: string, clientNumber: string): Promise<Invoice> {
    let customer = await this.customerRepository.findOneBy({ clientNumber: clientNumber });
    if(!customer) {
      customer = await this.createCustomer(name, clientNumber);
    }

    this.createInvoice(invoice, customer);

    return new Invoice();
  }

  async findCustomerByClientNumber(clientNumber: string): Promise<Customer | null> {
    return await this.customerRepository.findOneBy({ clientNumber: clientNumber });
  }
  
}
