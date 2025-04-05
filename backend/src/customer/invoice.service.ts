import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { CustomerService } from '../customer/customer.service';
import { CustomerEnergyConsumedDTO } from '../dtos/CustomerEnergyConsumed.dto';
import { CustomerFinancialResultsDTO } from '../dtos/CustomerFinancialResults.dto';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    private readonly customerService: CustomerService,
    private readonly utilsService: UtilsService) {}

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
      
      invoice.referenceMonth = this.utilsService.parseDate(data.clientInfo.referenceMonth);
      invoice.energyElectricQuantity = this.utilsService.parseNumber(data.consumptionData?.energyElectric?.quantity);
      invoice.energyElectricAmount = this.utilsService.parseNumber(data.consumptionData?.energyElectric?.value);
      invoice.energySCEEQuantity = this.utilsService.parseNumber(data.consumptionData?.energySCEE?.quantity);
      invoice.energySCEEAmount = this.utilsService.parseNumber(data.consumptionData?.energySCEE?.value);
      invoice.energyCompensatedQuantity = this.utilsService.parseNumber(data.consumptionData?.energyCompensated?.quantity);
      invoice.energyCompensatedAmount = this.utilsService.parseNumber(data.consumptionData?.energyCompensated?.value);
      invoice.publicLightingAmount = this.utilsService.parseNumber(data.consumptionData?.publicLighting);
      invoice.invoiceAmount = this.utilsService.parseNumber(data.consumptionData?.total);
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

  async calculateCustomerEnergyConsumed(): Promise<CustomerEnergyConsumedDTO> {
    const invoices = await this.invoiceRepository.find();
    
    return this.groupCustomerEnergyConsumed(invoices);
  }

  groupCustomerEnergyConsumed(invoices: Invoice[]): CustomerEnergyConsumedDTO {
    return invoices.reduce(
      (acc, invoice) => {
        acc.energyElectricQuantity += (invoice.energyElectricQuantity + invoice.energySCEEQuantity) || 0;
        acc.energyCompensatedQuantity += invoice.energyCompensatedQuantity || 0;
        return acc;
      },
      new CustomerEnergyConsumedDTO({
        energyElectricQuantity: 0,
        energyCompensatedQuantity: 0,
      }),
    );
  }


  async calculateCustomerFinancialResults(): Promise<CustomerFinancialResultsDTO> {
    const invoices = await this.invoiceRepository.find();
    
    return this.groupCustomerFinancialResults(invoices);
  }
  
  groupCustomerFinancialResults(invoices: Invoice[]): CustomerFinancialResultsDTO {
    const result = invoices.reduce(
      (acc, invoice) => {
        acc.totalAmountWwithoutGD += (invoice.energyElectricAmount + invoice.energySCEEAmount + invoice.publicLightingAmount) || 0;
        acc.amountSaved += invoice.energyCompensatedAmount || 0;
        return acc;
      },
      new CustomerFinancialResultsDTO({
        totalAmountWwithoutGD: 0,
        amountSaved: 0,
      }),
    );
    return result.toFixed();
  }
  
}
