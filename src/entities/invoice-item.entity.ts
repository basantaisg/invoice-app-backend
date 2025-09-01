import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from './product.entity';

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Invoice, (inv) => inv.items, { onDelete: 'CASCADE' })
  invoice: Invoice;
  @ManyToOne(() => Product, { eager: true }) product: Product;
  @Column('int') quantity: number;
  @Column('numeric', { precision: 12, scale: 2 }) unitPrice: string; // snapshot at time
  @Column('numeric', { precision: 5, scale: 2, default: 0 }) taxRatePct: string; // e.g. 13.00
  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  discountAmount: string; // absolute per line
  @Column('numeric', { precision: 12, scale: 2 }) lineTotal: string; // computed
}
