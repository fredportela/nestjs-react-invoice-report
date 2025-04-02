import { useState, useEffect } from 'react';
import api from '../services/api';
import { Customer } from '../types/Customer';

export const useCustomer = (clientNumber: string) => {
  const [customer, setCustomer] = useState<Customer>();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!clientNumber) return;

      try {
        const response = await api.get(`/customers/${clientNumber}`);
        let data = response.data as Customer;

        setCustomer(data);
      } catch (error) {
        console.error('Erro ao buscar Cliente:', error);
        setCustomer(undefined);
      }
    };

    fetchInvoices();
  }, [clientNumber]);

  return customer;
};
