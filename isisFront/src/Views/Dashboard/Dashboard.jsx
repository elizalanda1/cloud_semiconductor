import React from 'react';
import { Row, Col } from 'antd';
import Nav from '../../components/Nav';
import CameraFeed from '../../components/Camera';
import InspectionResult from '../../components/InspectionResult';
import InventoryCard from '../../components/InventoryCard';
import ReportSummary from '../../components/ReportSummary';
import EmergencyButton from '../../components/emergencyButton'
import InspectionButtons from '../../components/InspectionsButtons'
import './index.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Navbar */}
      <Row>
        <Col span={24}>
          <Nav />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="content-row">
        {/* Columna de Inventario */}
        <Col xs={24} sm={6} md={6} lg={5} className="inventory-col">
          <InventoryCard />
        </Col>

        {/* Columna Central con la Cámara y el Resultado de Inspección */}
        <Col xs={24} sm={12} md={12} lg={14} className="camera-col">
          <h2 className="section-title">Inspección</h2>
          <CameraFeed />
          {/*<InspectionResult />*/}
          <InspectionButtons/>
        </Col>

        {/* Columna de Reporte */}
        <Col xs={24} sm={6} md={6} lg={5} className="report-col">
          <EmergencyButton />
          <ReportSummary />
        </Col>
      </Row>
    </div>
  );
};

export default MainLayout;
