import React from 'react';
import { Layout, Row, Col } from 'antd';
import './LayoutComponent.css';

const { Header, Footer, Content } = Layout;

const LayoutComponent = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header">Sistema de Inspección de Semiconductores</Header>
      <Content style={{ margin: '16px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <div className="left-pane">
              {/* Contenido del lado izquierdo */}
              <h2>Columna Izquierda</h2>
            </div>
          </Col>
          <Col span={18}>
            <div className="right-pane">
              {/* Contenido del lado derecho */}
              <h2>Columna Derecha</h2>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Sistema de Inspección de Semiconductores ©2024</Footer>
    </Layout>
  );
};

export default LayoutComponent;
