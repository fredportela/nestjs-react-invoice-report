import { Injectable } from '@nestjs/common';

@Injectable()
export class DataTranformService {
  private extractValueByRegex(pdfText: string, regex: RegExp): string[] | null {
    const match = pdfText.match(regex);
    return match ? match.slice(1) : null;
  }

  private extractEnergyElectric(pdfText: string) {
    const match = this.extractValueByRegex(pdfText, /Energia Elétrica.*?(\d+(?:[.,]\d+)?)\s+[\d,\.]+\s+([\d,\.]+)/);
    return match ? { quantity: match[0], value: match[1] } : null;
  }

  private extractEnergySCEE(pdfText: string) {
    const match = this.extractValueByRegex(pdfText, /Energia SCEE.*?(\d+(?:[.,]\d+)?)\s+[\d,\.]+\s+([\d,\.]+)/);
    return match ? { quantity: match[0], value: match[1] } : null;
  }

  private extractEnergyCompensated(pdfText: string) {
    const match = this.extractValueByRegex(pdfText, /Energia compensada.*?\s+([\d,.]+)\s+([\d,.]+)\s+([-]?\d{1,3}(?:\.\d{3})*,\d+)\s+/);
    return match ? { quantity: match[0], value: match[2] } : null;
  }

  private extractPublicLighting(pdfText: string) {
    const match = this.extractValueByRegex(pdfText, /Contrib Ilum Publica.*?\s+([\d,\.]+)/);
    return match ? match[0] : null;
  }

  private extractTotal(pdfText: string) {
    const match = this.extractValueByRegex(pdfText, /TOTAL\s+([\d,\.]+)(?:\s+[\d,\.]+){0,3}/);
    return match ? match[0] : null;
  }

  public extractConsumptionData(pdfText: string) {
    return {
      energyElectric: this.extractEnergyElectric(pdfText),
      energySCEE: this.extractEnergySCEE(pdfText),
      energyCompensated: this.extractEnergyCompensated(pdfText),
      publicLighting: this.extractPublicLighting(pdfText),
      total: this.extractTotal(pdfText),
    };
  }

  private getLineSearchInText(pdfText: string, searchText: string): number {
    return pdfText.split('\n').findIndex(line => line.includes(searchText));
  }

  private extractMatch(text: string | undefined, regex: RegExp): string[] | null {
    return text ? text.match(regex) : null;
  }

  private extractClientNumberAndInstallation(pdfText: string, lines: string[]): { clientNumber: string | null, installationNumber: string | null } {
    const lineIndex = this.getLineSearchInText(pdfText, 'DO CLIENTE');
    if (lineIndex === -1) return { clientNumber: null, installationNumber: null };

    const match = this.extractMatch(lines[lineIndex + 1], /(-?\d+(?:[.,]\d+)?)\s+(-?\d+(?:[.,]\d+)?)/);
    return {
      clientNumber: match ? match[1] : null,
      installationNumber: match ? match[2] : null
    };
  }

  private extractClientName(pdfText: string, lines: string[]): string {
    const lineIndex = this.getLineSearchInText(pdfText, 'VencimentoTotal a pagar');
    if (lineIndex === -1) return '';

    const position = lineIndex + 3;
    const wrongLineNumber = lines[position]?.includes('ATENÇÃO');
    return wrongLineNumber ? lines[lineIndex + 5]?.trim() : lines[position]?.trim();
  }

  private extractReferenceMonthAndDueDate(pdfText: string, lines: string[]): { referenceMonth: string | null, dueDate: string | null } {
    const lineIndex = this.getLineSearchInText(pdfText, 'Referente a');
    if (lineIndex === -1) return { referenceMonth: null, dueDate: null };

    const match = this.extractMatch(lines[lineIndex + 1], /\s+(\w+\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+([\d,\.]+)/);
    return {
      referenceMonth: match ? match[1] : null,
      dueDate: match ? match[2] : null
    };
  }

  private extractClientInfo(pdfText: string) {
    const lines = pdfText.split('\n');

    const { clientNumber, installationNumber } = this.extractClientNumberAndInstallation(pdfText, lines);
    const clientName = this.extractClientName(pdfText, lines);
    const { referenceMonth, dueDate } = this.extractReferenceMonthAndDueDate(pdfText, lines);

    return {
      clientNumber,
      installationNumber,
      clientName,
      referenceMonth,
      dueDate
    };
  }

  extractData(pdfText: string) {
    return {
      clientInfo: this.extractClientInfo(pdfText),
      consumptionData: this.extractConsumptionData(pdfText),
    };
  }
}
