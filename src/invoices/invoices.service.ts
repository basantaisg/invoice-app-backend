import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { InvoiceItem } from 'src/entities/invoice-item.entity';
import { Customer } from 'src/entities/customer.entity';
import { Product } from 'src/entities/product.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Notification } from 'rxjs';

function toMoney(n: number): string {
  return n.toFixed(2);
}

function parseMoney(s: string | number | undefined): number {
  return Number(s || 0);
}

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoices: Repository<Invoice>,
    @InjectRepository(InvoiceItem) private items: Repository<InvoiceItem>,
    @InjectRepository(Customer) private customers: Repository<Customer>,
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  async create(dto: CreateInvoiceDto) {
    const customer = await this.customers.findOne({
      where: { id: dto.customerId },
    });

    if (!customer) throw new NotFoundException('Customer not found!');

    if (!dto.items?.length)
      throw new BadRequestException('Invoice requires at least one item!');

    const inv = this.invoices.create({
      customer,
      items: [],
      status: dto.status || 'DRAFT',
      notes: dto.notes,
      invoiceNumber: await this.nextInvoiceNumber(),
      subtotal: '0',
      taxTotal: '0',
      discountTotal: '0',
      grandTotal: '0',
    });

    let subtotal = 0,
      taxTotal = 0,
      discountTotal = 0;

    for (const line of dto.items) {
      const product = await this.products.findOne({
        where: { id: line.productId },
      });

      if (!product)
        throw new NotFoundException(`Product ${line.productId} not found!`);

      const qty = line.quantity;
      const unitPrice = parseMoney(line.unitPrice);
      const taxRate = parseMoney(line.taxRatePct);
      const discount = parseMoney(line.discountAmount);

      const base = qty * unitPrice;
      const tax = base * (taxRate / 100);
      const lineTotal = base + tax - discount;

      subtotal += base;
      taxTotal += tax;
      discountTotal += discount;

      const item = this.items.create({
        product,
        quantity: qty,
        unitPrice: toMoney(unitPrice),
        taxRatePct: toMoney(taxRate),
        discountAmount: toMoney(discount),
        lineTotal: toMoney(lineTotal),
        invoice: inv,
      });
      inv.items.push(item);
    }

    inv.subtotal = toMoney(subtotal);
    inv.taxTotal = toMoney(taxTotal);
    inv.discountTotal = toMoney(discountTotal);
    inv.grandTotal = toMoney(subtotal + taxTotal - discountTotal);

    return this.invoices.save(inv);
  }

  findAll() {
    return this.invoices.find({ order: { createdAt: 'DESC' } });
  }
  async findOne(id: string) {
    const inv = await this.invoices.findOne({ where: { id } });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }
  async markPaid(id: string) {
    const inv = await this.findOne(id);
    inv.status = 'PAID';
    return this.invoices.save(inv);
  }
  async cancel(id: string) {
    const inv = await this.findOne(id);
    inv.status = 'CANCELLED';
    return this.invoices.save(inv);
  }

  private async nextInvoiceNumber(): Promise<string> {
    const count = await this.invoices.count();
    const n = (count + 1).toString().padStart(4, '0');
    const year = new Date().getFullYear();
    return `INV-${year}-${n}`;
  }
}
