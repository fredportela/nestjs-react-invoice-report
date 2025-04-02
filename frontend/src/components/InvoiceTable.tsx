import React from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Invoice } from '../types/Invoice';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

interface InvoiceTableProps {
  invoices: Invoice[];
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mês de Referência</TableCell>
            <TableCell>Quantidade de Energia (kWh)</TableCell>
            <TableCell>Valor da Fatura (R$)</TableCell>
            <TableCell>Nome do Arquivo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.referenceMonth}</TableCell>
              <TableCell align="left">{invoice.energyElectricQuantity} kWh</TableCell>
              <TableCell align="left">R$ {invoice.invoiceAmount.toFixed(2)}</TableCell>
              <TableCell align="center">
                <IconButton
                  href={`${process.env.REACT_APP_API_URL}/customers/invoice/pdf/${invoice.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  >
                  <PictureAsPdfIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
