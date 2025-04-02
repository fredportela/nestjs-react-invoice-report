import { Card, CardContent, Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { FinancialResults } from "../types/FinancialResults";

interface FinancialPieChartProps {
  data: FinancialResults;
}

export const FinancialPieChart: React.FC<FinancialPieChartProps> = ({ data }) => {
 // Dados para o gráfico
 const chartData = {
  labels: ['Valor total sem GDR', 'Economia GDR'],
  datasets: [
    {
      data: [data.totalAmountWwithoutGD, data.amountSaved],
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
          return `${label}: R$ ${value.toFixed(2)}`;
        },
      },
    },
  },
};

return (
  <Card sx={{ width: '100%', margin: 'auto', mt: 4 }}>
    <CardContent>
      <Typography variant="h5" gutterBottom align="center">
        Resultados Financeiros
      </Typography>
      <Pie data={chartData} options={options} />
    </CardContent>
  </Card>
);
};
