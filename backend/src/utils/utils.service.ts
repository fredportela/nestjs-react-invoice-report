import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class UtilsService {
  /**
   * Converte uma string em número, tratando formatação de números brasileiros
   */
  parseNumber(value: string | undefined): number {
    return value ? parseFloat(value.replace('.', '').replace(',', '.')) || 0 : 0;
  }

  /**
   * Converte uma string de data no formato brasileiro para objeto Date
   * @param dateString String de data no formato 'MMM/YYYY' (ex: 'Jan/2023')
   */
  parseDate(dateString: string): Date {
    return moment(dateString, 'MMM/YYYY', 'pt').isValid()
      ? moment(dateString, 'MMM/YYYY', 'pt').toDate()
      : new Date();
  }
}
