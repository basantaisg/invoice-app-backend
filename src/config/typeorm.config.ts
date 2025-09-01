import { Customer } from 'src/entities/customer.entity';
import { InvoiceItem } from 'src/entities/invoice-item.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { Product } from 'src/entities/product.entity';
import { DataSourceOptions } from 'typeorm';

export const typeOrmConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Customer, Product, Invoice, InvoiceItem],
  synchronize: true, // DEV ONLY. Use migrations for prod.
  logging: process.env.NODE_ENV !== 'production',
});
