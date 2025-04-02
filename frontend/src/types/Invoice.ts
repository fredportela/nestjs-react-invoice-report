export interface Invoice {
  id: number;
  referenceMonth: string;
  energyElectricQuantity: number;
  energyElectricAmount: number;
  energySCEEQuantity: number;
  energySCEEAmount: number;
  energyCompensatedQuantity: number;
  energyCompensatedAmount: number;
  publicLightingAmount: number;
  invoiceAmount: number;
  fileName: string;
}
