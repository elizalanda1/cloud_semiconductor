import React from 'react';
import { Row, Col } from 'antd';
import Nav from '../components/Nav';
import Analytics from '../components/Analitics/index';
import './Analitics.css';

const AnalyticsView = () => {
  return (
    <div className="analytics-view">
      {/* Navbar */}
      <Row>
        <Col span={24}>
          <Nav />
        </Col>
      </Row>

      {/* Analytics */}
      <Row justify="center" className="content-row">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Analytics />
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsView;
