import { DataTranformService } from './data-transform.service';
import * as fs from 'fs-extra';

describe('DataTranformService', () => {
  let service: DataTranformService;

  beforeEach(() => {
    service = new DataTranformService();
  });

  it('should extract data correctly from PDF text', async () => {
    const mockPdfText = await fs.readFile('./test/data/3001116735-01-2024.txt', 'utf-8');

    const result = service.extractData(mockPdfText);
    expect(result).toEqual({
      clientInfo: {
        clientNumber: '7204076116',
        installationNumber: '3001116735',
        clientName: 'JOSE MESALY FONSECA DE CARVALHO 52024156',
        referenceMonth: 'JAN/2024',
        dueDate: '12/02/2024'
      },
      consumptionData: {
        energyElectric: { quantity: '50', value: '47,75' },
        energySCEE: { quantity: '456', value: '232,42' },
        energyCompensated: { quantity: '456', value: '-222,22' },
        publicLighting: '49,43',
        total: '107,38'
      }
    });
  });

  it('should return null values when information is missing', () => {
    const mockPdfText = `Documento sem informações relevantes`;

    const result = service.extractData(mockPdfText);

    expect(result).toEqual({
      clientInfo: {
        clientNumber: null,
        installationNumber: null,
        clientName: '',
        referenceMonth: null,
        dueDate: null,
      },
      consumptionData: {
        energyElectric: null,
        energySCEE: null,
        energyCompensated: null,
        publicLighting: null,
        total: null,
      },
    });
  });
});
