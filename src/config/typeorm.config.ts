import { DataSourceOptions } from 'typeorm';

export const typeOrmConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //   entities: [Customer, Product, Invoice, InvoiceItem],
  synchronize: true, // DEV ONLY. Use migrations for prod.
  logging: process.env.NODE_ENV !== 'production',
});
