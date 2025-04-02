import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity()
export class Customer {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clientNumber: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

}
