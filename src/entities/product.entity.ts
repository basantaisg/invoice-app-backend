import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column('numeric', { precision: 12, scale: 2 }) unitPrice: string; // DECIMAL stored as string in TS
  @Column({ nullable: true }) description?: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
