import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs-extra';
import { PdfExtractorService } from './pdf-extractor.service';
import { DataTranformService } from './data-transform.service';
import { InvoiceService } from '../customer/invoice.service';
import { Invoice } from '../entities/invoice.entity';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../entities/customer.entity';
import { UtilsService } from '../utils/utils.service';

const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('PdfExtractorService', () => {
  let service: PdfExtractorService;
  let invoiceRepository: Repository<Invoice>;
  let customerRepository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PdfExtractorService, 
        DataTranformService,
        InvoiceService, 
        ConfigService,
        CustomerService,
        UtilsService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PdfExtractorService>(PdfExtractorService);
    invoiceRepository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
    customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should extract text from PDF', async () => {
    const mockFilePath = './test/data/3001116735-01-2024.pdf';
    const textPdf = await service.extractTextFromPdf(mockFilePath);
    const textExtract = await fs.readFile('./test/data/3001116735-01-2024.txt', 'utf-8');
    expect(textPdf).toBe(textExtract);
  });

});
