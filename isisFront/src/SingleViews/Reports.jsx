import React from 'react';
import { Row, Col } from 'antd';
import Nav from '../components/Nav';
import ReportSummary from '../components/ReportSummary';
import './index.css';

const ReportView = () => {
  return (
    <div className="report-view">
      {/* Navbar */}
      <Row>
        <Col span={24}>
          <Nav />
        </Col>
      </Row>

      {/* Reporte */}
      <Row justify="center" className="content-row">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <ReportSummary />
        </Col>
      </Row>
    </div>
  );
};

export default ReportView;
