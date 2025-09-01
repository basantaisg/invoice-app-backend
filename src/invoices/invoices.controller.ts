import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id/pay')
  async markPaid(@Param('id') id: string) {
    return this.invoicesService.markPaid(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.invoicesService.cancel(id);
  }
}
