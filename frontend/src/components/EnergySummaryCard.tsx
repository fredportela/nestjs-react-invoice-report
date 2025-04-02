import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { FinancialResults } from "../types/FinancialResults";
import { EnergyComsumed } from "../types/EnergyComsumed";

interface EnergySummaryCardProps {
  energy: EnergyComsumed;
  fincancial: FinancialResults;
}

const EnergySummaryCard: React.FC<EnergySummaryCardProps> = ({ energy, fincancial }) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, p: 1, width: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resumo de Energia
        </Typography>
        <Grid container spacing={2}>
          <Grid >
            <Typography variant="body1">Consumo Energia: {energy.energyElectricQuantity} kWh</Typography>
          </Grid>
          <Grid >
            <Typography variant="body1">Valor Total sem GDR: R$ {fincancial.totalAmountWwithoutGD.toFixed(2)}</Typography>
          </Grid>
          <Grid  display="flex" alignItems="center" gap={1}>
            {fincancial.amountSaved >= 0 ? <TrendingDown color="success" /> : <TrendingUp color="error" />}
            <Typography variant="body1">
              Valor Economia: R$ {Math.abs(fincancial.amountSaved).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EnergySummaryCard;
