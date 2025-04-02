import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' }) 
  referenceMonth: Date;
  
  @Column({ type: 'integer' }) 
  energyElectricQuantity: number;

  @Column({ 
    type: 'numeric', 
    precision: 10, 
    scale: 2, 
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  }) 
  energyElectricAmount: number;

  @Column({ type: 'integer' }) 
  energySCEEQuantity: number;

  @Column({ 
    type: 'numeric', 
    precision: 10, 
    scale: 2, 
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  }) 
  energySCEEAmount: number;

  @Column({ type: 'integer' }) 
  energyCompensatedQuantity: number;

  @Column({ 
    type: 'numeric', 
    precision: 10, 
    scale: 2, 
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  }) 
  energyCompensatedAmount: number;

  @Column({ 
    type: 'numeric', 
    precision: 10, 
    scale: 2, 
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  }) 
  publicLightingAmount: number;

  @Column({ 
    type: 'numeric', 
    precision: 10, 
    scale: 2, 
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  }) 
  invoiceAmount: number;

  @Column({ length: 200, unique: true })
  fileName: string;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer: Customer; // Relacionamento N:1 com Customer
}
