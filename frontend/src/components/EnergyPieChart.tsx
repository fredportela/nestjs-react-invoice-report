import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography } from '@mui/material';
import { EnergyComsumed } from '../types/EnergyComsumed';

// Registra os componentes necessários para o gráfico de pizza
ChartJS.register(ArcElement, Tooltip, Legend);

interface EnergyPieChartProps {
  data: EnergyComsumed;
}

export const EnergyPieChart: React.FC<EnergyPieChartProps> = ({ data }) => {
  // Dados para o gráfico
  const chartData = {
    labels: ['Energia Consumida (kWh)', 'Energia Economizada (kWh)'],
    datasets: [
      {
        data: [data.energyElectricQuantity, data.energyCompensatedQuantity],
        backgroundColor: ['#FF6384', '#36A2EB'], // Cores para cada fatia
        hoverBackgroundColor: ['#FF6384CC', '#36A2EBCC'],
        borderWidth: 1,
      },
    ],
  };

  // Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(2)} kWh`;
          },
        },
      },
    },
  };

  return (
    <Card sx={{ width: '100%', margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          Resultados de Energia
        </Typography>
        <Pie data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};
