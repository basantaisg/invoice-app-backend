import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import type { InvoiceStatus } from 'src/entities/invoice.entity';

export class InvoiceItemInputDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumberString()
  unitPrice: string;

  @IsNumberString()
  @IsOptional()
  taxRatePct?: string;

  @IsNumberString()
  @IsOptional()
  discountAmount?: string;
}

export class CreateInvoiceDto {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemInputDto)
  items: InvoiceItemInputDto[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'SENT', 'PAID', 'CANCELLED'])
  status?: InvoiceStatus;
}
