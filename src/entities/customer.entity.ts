import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ unique: true }) email: string;
  @Column({ nullable: true }) phone?: string;
  @Column({ nullable: true }) addressLine1?: string;
  @Column({ nullable: true }) addressLine2?: string;
  @Column({ nullable: true }) city?: string;
  @Column({ nullable: true }) country?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @OneToMany(() => Invoice, (inv) => inv.customer) invoices: Invoice[];
}
