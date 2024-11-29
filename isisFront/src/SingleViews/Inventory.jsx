import React from 'react';
import { Row, Col } from 'antd';
import Nav from '../components/Nav';
import InventoryCrud from '../components/inventorycrud/index';
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
          <InventoryCrud />
        </Col>
      </Row>
    </div>
  );
};

export default InventoryView;
