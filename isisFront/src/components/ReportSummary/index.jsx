import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { fetchReportData, updateReportData } from '../../services/Api';
import jsPDF from 'jspdf';
import './index.css';

const ReportSummary = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await fetchReportData();
      setReportData(data);
    } catch (error) {
      console.error('Error al cargar el reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async () => {
    setLoading(true);
    try {
      const updatedData = await updateReportData(); // Llama al endpoint para actualizar el reporte
      setReportData(updatedData);
    } catch (error) {
      console.error('Error al actualizar el reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Inspección", 10, 10);
    doc.text(`Fecha del Reporte: ${new Date(reportData.reportDate).toLocaleString()}`, 10, 20);
    doc.text(`Total Inspeccionado: ${reportData.totalInspected}`, 10, 30);
    doc.text(`Total Buenos: ${reportData.totalGood}`, 10, 40);
    doc.text(`Total Defectuosos: ${reportData.totalDefective}`, 10, 50);
    doc.save("Reporte_Inspeccion.pdf");
  };

  if (loading) {
    return <p>Cargando reporte...</p>;
  }

  return (
    <Card title="Resumen de Inspección" className="report-summary-card">
      <p>Fecha del Reporte: {new Date(reportData.reportDate).toLocaleString()}</p>
      <p>Total Inspeccionado: {reportData.totalInspected}</p>
      <p>Total Buenos: {reportData.totalGood}</p>
      <p>Total Defectuosos: {reportData.totalDefective}</p>
      <Button type="primary" onClick={handleUpdateReport} className="update-button">
        Actualizar
      </Button>
      <Button type="default" onClick={generatePDF} className="pdf-button">
        Generar PDF
      </Button>
    </Card>
  );
};

export default ReportSummary;
