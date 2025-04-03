import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Invoice } from '../entities/invoice.entity';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    private readonly customerService: CustomerService) {}

  private parseNumber(value: string | undefined): number {
    return value ? parseFloat(value.replace('.', '').replace(',', '.')) || 0 : 0;
  }

  private parseDate(dateString: string): Date {
    return moment(dateString, 'MMM/YYYY', 'pt').isValid()
      ? moment(dateString, 'MMM/YYYY', 'pt').toDate()
      : new Date();
  }

  public async findAll(filter: any): Promise<Invoice[]> {
    const where = { where: filter }
    return this.invoiceRepository.find(where);
  }

  async findInvoicesCustomerNumber(clientNumber: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({ where: { customer: { clientNumber: clientNumber }}});
  }
  
  public async saveInvoice(data: any): Promise<void> {
    try {
      const invoice = new Invoice();
      
      invoice.referenceMonth = this.parseDate(data.clientInfo.referenceMonth);
      invoice.energyElectricQuantity = this.parseNumber(data.consumptionData?.energyElectric?.quantity);
      invoice.energyElectricAmount = this.parseNumber(data.consumptionData?.energyElectric?.value);
      invoice.energySCEEQuantity = this.parseNumber(data.consumptionData?.energySCEE?.quantity);
      invoice.energySCEEAmount = this.parseNumber(data.consumptionData?.energySCEE?.value);
      invoice.energyCompensatedQuantity = this.parseNumber(data.consumptionData?.energyCompensated?.quantity);
      invoice.energyCompensatedAmount = this.parseNumber(data.consumptionData?.energyCompensated?.value);
      invoice.publicLightingAmount = this.parseNumber(data.consumptionData?.publicLighting);
      invoice.invoiceAmount = this.parseNumber(data.consumptionData?.total);
      invoice.fileName = data.fileName;

      const customer = await this.customerService.createCustomer(data.clientInfo.clientName, data.clientInfo.clientNumber);
      invoice.customer = customer;

      const oldInvoce = await this.invoiceRepository.findOneBy({ fileName: data.fileName, customer: { clientNumber: data.clientInfo.clientNumber } });

      if(!oldInvoce) {
        this.logger.log(`💾 Fatura salva no banco de dados: Cliente ${data.clientInfo.clientName} - Número ${data.clientInfo.clientNumber}`);
        await this.invoiceRepository.save(invoice);
      }
      
    } catch (error) {
      this.logger.error('❌ Erro ao salvar a fatura:', error);
    }
  }
}
