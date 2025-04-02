import { Controller, Get, Param } from '@nestjs/common';
import { CustomerEnergyConsumedDTO } from './dto/CustomerEnergyConsumed.dto';
import { InvoiceService } from 'src/customer/invoice.service';
import { CustomerFinancialResultsDTO } from './dto/CustomerFinancialResults.dto';

@Controller('api/dashboard')
export class DashboardController {
  constructor(
    private readonly invoiceService: InvoiceService) {}


  @Get('/customer-energy-consumed')
  async customerEnergyConsumed(): Promise<CustomerEnergyConsumedDTO> {
        const invoices = await this.invoiceService.findAll({});

    const customerEnergyConsumed = invoices.reduce(
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

    return customerEnergyConsumed;
  }

  @Get('/customer-financial-results')
  async customerFinancialRresults(): Promise<CustomerFinancialResultsDTO> {
    const invoices = await this.invoiceService.findAll({});

    const customerFinancialResults = invoices.reduce(
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

    return customerFinancialResults.toFixed();
  }
  
}
