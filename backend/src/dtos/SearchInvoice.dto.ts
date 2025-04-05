import { IsOptional, IsInt, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchInvoiceDto {
  
  @IsOptional()
  @IsDateString()
  referenceMonth?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minEnergyElectricQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxEnergyElectricQuantity?: number;
}
