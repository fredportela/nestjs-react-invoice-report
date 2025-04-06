import { Controller, Get } from '@nestjs/common';
import { CustomerEnergyConsumedDTO } from '../dtos/CustomerEnergyConsumed.dto';
import { InvoiceService } from 'src/customer/invoice.service';
import { CustomerFinancialResultsDTO } from '../dtos/CustomerFinancialResults.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly invoiceService: InvoiceService) {}


  @Get('/customer-energy-consumed')
  async customerEnergyConsumed(): Promise<CustomerEnergyConsumedDTO> {
    return await this.invoiceService.calculateCustomerEnergyConsumed();
  }

  @Get('/customer-financial-results')
  async customerFinancialRresults(): Promise<CustomerFinancialResultsDTO> {
    return await this.invoiceService.calculateCustomerFinancialResults();
  }
  
}
