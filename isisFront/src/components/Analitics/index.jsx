import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Button } from 'antd';
import { fetchInventoryData, fetchReportData } from '../../services/Api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const inventory = await fetchInventoryData();
      const report = await fetchReportData();

      console.log('Inventory Data:', inventory);
      console.log('Report Data:', report);

      setInventoryData(Array.isArray(inventory) ? inventory : []);
      setReportData(report ? [report] : []); // Adaptar el formato para reportData
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setInventoryData([]);
      setReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  if (isLoading) {
    return <div>Loading Data...</div>;
  }

  // Gráfica 1: Cantidad Total en Inventario
  const inventoryTotalData = {
    labels: inventoryData.map((item) => item.name || 'Sin Nombre'),
    datasets: [
      {
        label: 'Total Amount',
        data: inventoryData.map((item) => item.totalQuantity || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Gráfica 2: Distribución de Buenos y Defectuosos
  const inventoryDistributionData = {
    labels: inventoryData.map((item) => item.name || 'Sin Nombre'),
    datasets: [
      {
        label: 'Good',
        data: inventoryData.map((item) => item.goodQuantity || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Defective',
        data: inventoryData.map((item) => item.defectiveQuantity || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Gráfica 3: Tendencia de Inspecciones
  const inspectionsTrendData = {
    labels: reportData.map((item) =>
      item.reportDate ? new Date(item.reportDate).toLocaleDateString() : 'Fecha Desconocida'
    ),
    datasets: [
      {
        label: 'Total Inspeccionated',
        data: reportData.map((item) => item.totalInspected || 0),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Gráfica 4: Comparación de Buenos y Defectuosos en Reportes
  const trendLineData = {
    labels: reportData.map((item) =>
      item.reportDate ? new Date(item.reportDate).toLocaleDateString() : 'Fecha Desconocida'
    ),
    datasets: [
      {
        label: 'Good',
        data: reportData.map((item) => item.totalGood || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Defective',
        data: reportData.map((item) => item.totalDefective || 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Gráfica 5: Porcentaje de Buenos vs Defectuosos
  const totalGood = reportData.reduce((sum, item) => sum + (item.totalGood || 0), 0);
  const totalDefective = reportData.reduce((sum, item) => sum + (item.totalDefective || 0), 0);

  const pieChartData = {
    labels: ['Good', 'Defective'],
    datasets: [
      {
        data: [totalGood, totalDefective],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
  };

  return (
    <div>
      <Button type="primary" onClick={loadAnalyticsData} style={{ marginBottom: '16px' }}>
        Actualizar Gráficas
      </Button>

      <h2>Inventory: Total Amount</h2>
      <Bar data={inventoryTotalData} options={options} />

      <h2>Distribution of Good y Defective</h2>
      <Bar data={inventoryDistributionData} options={options} />

      {/* <h2>Tendencia de Inspecciones</h2>
      <Line data={inspectionsTrendData} options={options} />

      <h2>Comparación de Buenos y Defectuosos</h2>
      <Line data={trendLineData} options={options} /> */}

      <h2>Percentage of Good vs Defective</h2>
      <Pie data={pieChartData} options={options} />
    </div>
  );
};

export default Analytics;
