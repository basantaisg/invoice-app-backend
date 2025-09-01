import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { InvoiceItem } from './invoice-item.entity';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Customer, (c) => c.invoices, {
    eager: true,
    onDelete: 'CASCADE',
  })
  customer: Customer;
  @OneToMany(() => InvoiceItem, (item) => item.invoice, {
    cascade: true,
    eager: true,
  })
  items: InvoiceItem[];
  @Column('numeric', { precision: 14, scale: 2, default: 0 }) subtotal: string;
  @Column('numeric', { precision: 14, scale: 2, default: 0 }) taxTotal: string;
  @Column('numeric', { precision: 14, scale: 2, default: 0 })
  discountTotal: string;
  @Column('numeric', { precision: 14, scale: 2, default: 0 })
  grandTotal: string;
  @Column({ type: 'varchar', length: 12, default: 'DRAFT' })
  status: InvoiceStatus;
  @Column({ nullable: true }) notes?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @Column({ unique: true }) invoiceNumber: string; // e.g. INV-2025-0001
}
