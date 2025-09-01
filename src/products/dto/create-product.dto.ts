import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumberString()
  unitPrice: string;
  @IsOptional()
  @IsString()
  description?: string;
}
