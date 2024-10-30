import React from 'react';
import { Row, Col } from 'antd';
import Nav from '../components/Nav';
import InventoryCard from '../components/InventoryCard';
import './index.css';

const InventoryView = () => {
  return (
    <div className="inventory-view">
      {/* Navbar */}
      <Row>
        <Col span={24}>
          <Nav />
        </Col>
      </Row>

      {/* Inventario */}
      <Row justify="center" className="content-row">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <InventoryCard />
        </Col>
      </Row>
    </div>
  );
};

export default InventoryView;
