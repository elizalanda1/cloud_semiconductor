import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { fetchReportData, updateReportData } from '../../services/Api';
import jsPDF from 'jspdf';
import './index.css';
import logo from './MiraiLogo.jpg';


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
  
    // Cargar el logo importado
    const img = new Image();
    img.src = logo; // Usa la ruta generada por Webpack
  
    img.onload = function () {
      doc.addImage(img, 'JPEG', 10, 10, 30, 30); // Agregar el logo
  
      // Título del reporte
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Reporte de Inspección", 50, 20);
  
      // Información del reporte
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
  
      const marginX = 10;
      let currentY = 50;
      const lineHeight = 10;
  
      if (reportData) {
        doc.text(`Fecha del Reporte: ${new Date(reportData.reportDate).toLocaleString()}`, marginX, currentY);
        currentY += lineHeight;
        doc.text(`Total Inspeccionado: ${reportData.totalInspected}`, marginX, currentY);
        currentY += lineHeight;
        doc.text(`Total Buenos: ${reportData.totalGood}`, marginX, currentY);
        currentY += lineHeight;
        doc.text(`Total Defectuosos: ${reportData.totalDefective}`, marginX, currentY);
      }
  
      // Guardar el PDF
      doc.save("Reporte_Inspeccion.pdf");
    };
  
    img.onerror = function () {
      console.error('No se pudo cargar el logo. Verifica la importación.');
    };
  };
  
  
  

  if (loading) {
    return <p>Cargando reporte...</p>;
  }

  return (
    <Card title="Inspection Summary" className="report-summary-card">
      <p>Report Date: {new Date(reportData.reportDate).toLocaleString()}</p>
      <p>Total Inspected: {reportData.totalInspected}</p>
      <p>Total Good: {reportData.totalGood}</p>
      <p>Total Defective: {reportData.totalDefective}</p>
      <Button type="primary" onClick={handleUpdateReport} className="update-button">
        Update
      </Button>
      <Button type="default" onClick={generatePDF} className="pdf-button">
        Generate PDF
      </Button>
    </Card>
  );
};

export default ReportSummary;
