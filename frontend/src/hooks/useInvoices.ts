import { useState, useEffect } from 'react';
import api from '../services/api';
import { Invoice } from '../types/Invoice';
import moment from "moment";

const formatReferenceDatePtBR = (dateString: string): string => {
  const date = moment(dateString).startOf("day");
  return date.format("MM/YYYY");
};

export const useInvoices = (clientNumber: string, searchPeriod?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!clientNumber) return;

      try {
        const response = await api.get(`/customers/invoices/${clientNumber}`);
        let data = response.data as Invoice[];

        let filterPeriod = searchPeriod;
        if (searchPeriod && searchPeriod.match(/^\d{2}\/\d{4}$/)) {
          const [month, year] = searchPeriod.split('/');
          filterPeriod = `${year}-${month}`;
        }

        if (filterPeriod) {
          data = data.filter((invoice) => invoice.referenceMonth.includes(filterPeriod ?? ''));
        }

        data = data.map((invoice) => ({
          ...invoice,
          referenceMonth: formatReferenceDatePtBR(invoice.referenceMonth),
        }));

        setInvoices(data);
      } catch (error) {
        console.error('Erro ao buscar faturas:', error);
        setInvoices([]);
      }
    };

    fetchInvoices();
  }, [clientNumber, searchPeriod]);

  return invoices;
};
