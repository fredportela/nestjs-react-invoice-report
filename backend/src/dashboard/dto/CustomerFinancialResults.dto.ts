import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class CustomerFinancialResultsDTO {

  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(parseFloat(value).toFixed(2)) : 0))
  totalAmountWwithoutGD: number;
  
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(parseFloat(value).toFixed(2)) : 0))
  amountSaved: number;
  
  constructor(data: Partial<CustomerFinancialResultsDTO>) {
    this.totalAmountWwithoutGD = data.totalAmountWwithoutGD ?? 0;
    this.amountSaved = data.amountSaved ?? 0;
  }

  toFixed(): CustomerFinancialResultsDTO {
    return new CustomerFinancialResultsDTO({
      totalAmountWwithoutGD: Number(this.totalAmountWwithoutGD.toFixed(2)),
      amountSaved: Math.abs(Number(this.amountSaved.toFixed(2))),
    });
  }
}
