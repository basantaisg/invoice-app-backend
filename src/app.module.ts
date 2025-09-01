import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CustomersModule,
    ProductsModule,
    InvoicesModule,
    // TypeOrmModule.forRootAsync({useFactory: typeOrmConfig})
  ],
})
export class AppModule {}
