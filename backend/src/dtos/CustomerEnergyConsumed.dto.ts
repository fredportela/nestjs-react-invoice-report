
export class CustomerEnergyConsumedDTO {

    energyElectricQuantity: number;
    
    energyCompensatedQuantity: number;
    
    constructor(data: Partial<CustomerEnergyConsumedDTO>) {
      this.energyElectricQuantity = data.energyElectricQuantity || 0;
      this.energyCompensatedQuantity = data.energyCompensatedQuantity || 0;
    }
}
