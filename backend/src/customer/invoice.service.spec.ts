import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceService } from './invoice.service';
import { Invoice } from '../entities/invoice.entity';
import { CustomerService } from '../customer/customer.service';
import { CustomerEnergyConsumedDTO } from '../dtos/CustomerEnergyConsumed.dto';
import { CustomerFinancialResultsDTO } from '../dtos/CustomerFinancialResults.dto';
import { UtilsService } from '../utils/utils.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceRepository: Repository<Invoice>;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        UtilsService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            createCustomer: jest.fn().mockResolvedValue({ id: 1, clientNumber: '123', name: 'John Doe' }),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
    customerService = module.get<CustomerService>(CustomerService);
  });

  describe('saveInvoice', () => {
    it('should save invoice if not already exists', async () => {
      const mockInvoice: Invoice = {
        id: 1,
        referenceMonth: new Date('2024-01-01'),
        energyElectricQuantity: 10.5,
        energyElectricAmount: 100.00,
        energySCEEQuantity: 2.0,
        energySCEEAmount: 20.00,
        energyCompensatedQuantity: 1.0,
        energyCompensatedAmount: 10.00,
        publicLightingAmount: 5.00,
        invoiceAmount: 135.00,
        fileName: 'invoice.pdf',
        customer: {
          id: 1,
          clientNumber: '123',
          name: 'John Doe'
        }
      };

      const data = {
        clientInfo: {
          referenceMonth: 'Jan/2024',
          clientName: 'John Doe',
          clientNumber: '123',
        },
        consumptionData: {
          energyElectric: { quantity: '10,5', value: '100,00' },
          energySCEE: { quantity: '2,0', value: '20,00' },
          energyCompensated: { quantity: '1,0', value: '10,00' },
          publicLighting: '5,00',
          total: '135,00',
        },
        fileName: 'invoice.pdf',
      };

      jest.spyOn(invoiceRepository, 'findOneBy').mockResolvedValue(null);
      const saveSpy = jest.spyOn(invoiceRepository, 'save').mockResolvedValue(mockInvoice);

      await service.saveInvoice(data);

      expect(customerService.createCustomer).toHaveBeenCalledWith('John Doe', '123');
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('calculateCustomerEnergyConsumed', () => {
    it('should calculate total energy consumed', () => {
      const invoices: Invoice[] = [
        {
          energyElectricQuantity: 100,
          energySCEEQuantity: 50,
          energyCompensatedQuantity: 30,
        } as Invoice,
        {
          energyElectricQuantity: 200,
          energySCEEQuantity: 100,
          energyCompensatedQuantity: 70,
        } as Invoice,
      ];

      const result = service.groupCustomerEnergyConsumed(invoices);

      expect(result).toEqual(
        new CustomerEnergyConsumedDTO({
          energyElectricQuantity: 450,
          energyCompensatedQuantity: 100,
        }),
      );
    });
  });

  describe('groupCustomerFinancialResults', () => {
    it('should calculate financial results with .toFixed()', () => {
      const invoices: Invoice[] = [
        {
          energyElectricAmount: 100,
          energySCEEAmount: 50,
          publicLightingAmount: 25,
          energyCompensatedAmount: 30,
        } as Invoice,
        {
          energyElectricAmount: 200,
          energySCEEAmount: 100,
          publicLightingAmount: 50,
          energyCompensatedAmount: 70,
        } as Invoice,
      ];

      const result = service.groupCustomerFinancialResults(invoices);

      expect(result).toEqual(
        new CustomerFinancialResultsDTO({
          totalAmountWwithoutGD: 525,
          amountSaved: 100,
        }).toFixed(),
      );
    });
  });
});
