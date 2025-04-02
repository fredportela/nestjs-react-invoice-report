import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { EnergyPieChart } from '../components/EnergyPieChart';
import { FinancialPieChart } from '../components/FinancialPieChart';
import api from '../services/api';
import { EnergyComsumed } from '../types/EnergyComsumed';
import { FinancialResults } from '../types/FinancialResults';

const ChartContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Grid >
    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
      {children}
    </Box>
  </Grid>
);

export const DashboardPage: React.FC = () => {
  const hasFetched = useRef(false);
  const [energyData, setEnergyData] = useState<EnergyComsumed>({ energyElectricQuantity: 0, energyCompensatedQuantity: 0 });
  const [financialData, setFinancialData] = useState<FinancialResults>({ totalAmountWwithoutGD: 0, amountSaved: 0 });

  const fetchEnergyData = async () => {
    try {
      const response = await api.get('/dashboard/customer-energy-consumed');
      const data = response.data as EnergyComsumed;
      setEnergyData(data);
    } catch (error) {
      console.error('Erro ao carregar dados de energia:', error);
      setEnergyData({ energyElectricQuantity: 0, energyCompensatedQuantity: 0 });
    }
  };

  const fetchFinancialData = async () => {
    try {
      const response = await api.get('/dashboard/customer-financial-results');
      const data = response.data as FinancialResults;
      setFinancialData(data);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      setFinancialData({ totalAmountWwithoutGD: 0, amountSaved: 0 });
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchEnergyData();
      fetchFinancialData();
      hasFetched.current = true; // Marca como executado
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid >
          <ChartContainer>
            <EnergyPieChart data={energyData} />
          </ChartContainer>
        </Grid>
        <Grid >
          <ChartContainer>
            <FinancialPieChart data={financialData} />
          </ChartContainer>
        </Grid>
      </Grid>

    </Container>
  );
};


