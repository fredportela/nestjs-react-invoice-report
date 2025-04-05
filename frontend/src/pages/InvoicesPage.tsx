import React, { useState } from 'react';
import { Container, TextField, Typography } from '@mui/material';

import { InvoiceTable } from '../components/InvoiceTable';
import { useInvoices } from '../hooks/useInvoices';
import { useCustomer } from '../hooks/useCustomer';
import CustomerDatails from '../components/CustomerDatails';

export const InvoicesPage: React.FC = () => {
  const [clientNumber, setClientNumber] = useState('');
  const [searchPeriod, setSearchPeriod] = useState('');
  const invoices = useInvoices(clientNumber, searchPeriod);
  const customer = useCustomer(clientNumber);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Faturas por Cliente
      </Typography>
      
      <TextField
        label="Número do Cliente"
        variant="outlined"
        fullWidth
        value={clientNumber}
        onChange={(e) => setClientNumber(() => e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      
      <TextField
        label="Filtrar por Período (MM/YYYY)"
        variant="outlined"
        fullWidth
        value={searchPeriod}
        onChange={(e) => setSearchPeriod(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      {clientNumber && customer ? (
        <>
          <CustomerDatails customer={customer} />
          <InvoiceTable invoices={invoices} />
        </>
      ) : (
        <Typography variant="body1" gutterBottom>
          Por favor, verifica o número do cliente.
        </Typography>
      )}
    </Container>
  );
};
