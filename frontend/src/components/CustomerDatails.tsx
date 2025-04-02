import React from "react";
import { Customer } from "../types/Customer";

interface CustomerProps {
  customer?: Customer;
}

const CustomerDatails: React.FC<CustomerProps> = ({ customer }) => {
 
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h2 className="text-lg font-semibold">Dados do Cliente</h2>
      <p><strong>Número do Cliente:</strong> {customer?.clientNumber}</p>
      <p><strong>Nome:</strong> {customer?.name}</p>
    </div>
  );
};

export default CustomerDatails;
